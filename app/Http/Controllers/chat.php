<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Messages;
use App\Models\Rooms;
use Illuminate\Support\Facades\Auth;
use App\Events\NewMessage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Detection\MobileDetect; 

//xdebug_connect_to_client();

class chat extends Controller
{
    public function index(Request $request) {

        $detect = new MobileDetect();
        $isMobile = false;

        try {
            $isMobile = $detect->isMobile(); // bool(false)
            //var_dump($isMobile);
        } catch (\Detection\Exception\MobileDetectException $e) {
        }



        if (Auth::check()) {
            $status = DB::table('users')->where('login', $request->session()->get('login'))->value('status');
            if ($status === 'admin') {
                return view('dev/m_private');
            }
           if ($isMobile) return view('prod/m_private');
            return view('prod/private');
        } else {
            if ($isMobile) return view('prod/m_lending');
            return view('prod/lending');
        }
    }

    public function access(Request $request) {
        $login = $request->all()['login'];

        $credentials = $request->validate([
            'login' => ['required', 'min:4', 'max:10'],
            'password' => ['required', 'min:5', 'max:16']
        ]);

        if($credentials) {
            if (Auth::attempt($credentials)) {
                $userData = DB::table('users')->select('id', 'login', 'name', 'pic_small', 'pic_orig', 'deleted_at')
                    ->where('login', $login)
                    ->first();
                if ($userData->deleted_at) return response('Not found', 404);
                $request->session()->regenerate();
                $request->session()->put('id', $userData->id);
                $request->session()->put('login', $userData->login);
                $request->session()->put('name', $userData->name);
                $request->session()->put('pic_small', $userData->pic_small);
                $request->session()->put('pic_orig', $userData->pic_orig);
                return response('redirect', 301)->header('Content-Location', '/');
            } else {
                return response('Invalid input data', 400);
            }
        } else {
            return response('Invalid input data', 400);
        }
    }

    public function profile() {
        return view('prod/private');
    }

    public function initialize(Request $request) {
        $outData = [
            'client' => array(),
            'users' => null,
            'last_msg' => null,
            'template' => null
        ];
        $users_to_roomIDs = array();
        $require_data = [];
        $userId = $request->session()->get('id');
        $rooms = unserialize(DB::table('users')->where('login', $request->session()->get('login'))->value('rooms'));

        $roomsData = null;
        $last_messages = null;

        if ($rooms && count($rooms)) {
            $roomsData = DB::table('rooms')
            ->select('id', 'type', 'participants')
            ->whereIn('id', $rooms)
            ->where('deleted_at', null)
            ->get();

            $last_messages = DB::table('messages')
            ->select('room', 'text')
            ->whereIn('id', DB::table('messages')
            ->select(DB::raw('max(id)'))
            ->where('deleted_at', null)
            ->whereIn('room', $rooms)
            ->groupBy('room'))
            ->get();

            foreach ($roomsData as $room) {
                if ($room->type == 1) {
                    $opponent = unserialize($room->participants);
                    $opponent = $opponent[0] == $userId ? $opponent[1] : $opponent[0];
                    $users_to_roomIDs[$opponent] = $room->id;
                    $require_data[] = $opponent;
                    //$outData[$room->id] = unserialize($room->room_name)[$userId];
                } else if ($room->type == 2) {
                    $outData[$room->id] = [$room->room_name, $room->pic_small];
                }
            }

            $usersData = DB::table('users')
                ->select('id', 'login', 'name', 'pic_small', 'deleted_at')
                ->whereIn('id', $require_data)
                ->get();

            $outData['users'] = $usersData;
            $outData['last_msg'] = $last_messages;
            $outData['template'] = $users_to_roomIDs;
        }

        $outData['client']['id'] = $userId;
        $outData['client']['login'] = $request->session()->get('login');
        $outData['client']['name'] = $request->session()->get('name');
        $outData['client']['pic_small'] = $request->session()->get('pic_small');
        $outData['client']['pic_orig'] = $request->session()->get('pic_orig');

        return response()->json($outData); 
    }

    public function search(string $nickname, Request $request) {
        if (!$nickname || $nickname == $request->session()->get('login')) return response('Not found', 404);
        $user = DB::table('users')
            ->select('id', 'login', 'name', 'pic_small', 'deleted_at')
            ->where('login', $nickname)
            ->first();
        if ($user) {
            if ($user->deleted_at) return response('Not found', 404);
            return response()->json($user);
        } else {
            return response('Not found', 404);
        }
    }

    public function getMessages(Request $request) {
        $room = $request->input('room');
        $messages = DB::table('messages')
            ->select('id', 'creator', 'putdate', 'text', 'hash')
            ->where('room', $room)
            ->where('deleted_at', null)
            ->get();
        /*$out_messages = [];
        foreach ($messages as $single_message) {
            $out_messages[$single_message->hash] = [
                'id' => $single_message->id,
                'creator' => $single_message->creator,
                'putdate' => $single_message->putdate,
                'text' => $single_message->text,
            ];
        } */
        return response()->json($messages);
    }

//DB::table('users')->where('login', $request->input('login'))->doesntExist()

    public function registration(Request $request) {
        if (mb_strlen($request->input('login'), 'UTF-8') > 3) {
            if ($request->input('password') === $request->input('confirm')) {
                if (DB::table('users')->where('login', $request->input('login'))->doesntExist()) {
                    $empty_list = [];
                    $empty_dict = array();
                    $user = User::create([
                        'login' => $request->input('login'),
                        'password' => bcrypt($request->input('password')),
                        'name' => $request->input('name'),
                        'status' => 'default',
                        'rooms' => serialize($empty_list),
                        'dialogs' => serialize($empty_dict),
                    ]);
                    Auth::loginUsingId($user->id);
                    $request->session()->regenerate();
                    $request->session()->put('id', $user->id);
                    $request->session()->put('login', $user->login);
                    $request->session()->put('name', $user->name);
                    #return view('chatEngine.index');
                    return response('redirect', 301)->header('Content-Location', '/');
                } else {
                    return response('Login is taken', 400);
                }
            } else {
                return response('Password confirm error', 400);
            }
        } else {
            return response('Login is too short', 400);
        }
    }

    public function newDialog(Request $request) {
        $user_id = $request->session()->get('id'); //  [id]
        $room_type = $request->input("type"); // dialog or group chat
        $out = array();
        if ($room_type == 1) {
            $target_id = json_decode($request->input("users"))[0];
            $data = DB::table('users')
                ->select('id', 'rooms', 'dialogs')
                ->whereIn('id', [$user_id, $target_id])
                ->get();

            $current_user = array();
            $target_user = array();
            foreach ($data as $dialog) {
                if ($dialog->id == $user_id) {
                    $current_user['id'] = $dialog->id;
                    $current_user['rooms'] = $dialog->rooms ? unserialize($dialog->rooms) : [];
                    $current_user['dialogs'] = $dialog->dialogs ? unserialize($dialog->dialogs) : [];
                } else {
                    $target_user['id'] = $dialog->id;
                    $target_user['rooms'] = unserialize($dialog->rooms);
                    $target_user['dialogs'] = unserialize($dialog->dialogs);
                }
            }

            if (array_key_exists($target_id, $current_user['dialogs'])) {
                DB::table('rooms')->where('id', '=', $current_user['dialogs'][$target_id])->update([
                    'deleted_at' => null
                ]);
                $out[] = $current_user['dialogs'][$target_id];
                //$out[] = $target_id;
            } else {
                $new_room_id = DB::table('rooms')->insertGetId([
                    'participants' => serialize([$user_id, $target_id]),
                    'created_at' => $request->input("created_at"),
                    'updated_at' => $request->input("created_at"),
                    'type' => 1
                ]);

                $current_user['rooms'][] = $new_room_id;
                $current_user['rooms'] = serialize($current_user['rooms']);
                $current_user['dialogs'][$target_id] = $new_room_id;
                $current_user['dialogs'] = serialize($current_user['dialogs']);

                $target_user['rooms'][] = $new_room_id;
                $target_user['rooms'] = serialize($target_user['rooms']);
                $target_user['dialogs'][$user_id] = $new_room_id;
                $target_user['dialogs'] = serialize($target_user['dialogs']);

                DB::table('users')->upsert(
                    [$target_user, $current_user],
                    ['id'],
                    ['rooms', 'dialogs']
                );

                $out[] = $new_room_id;
                //$out[] = $target_id;
            }

            return response()->json($out);
        } else if ($room_type == 2) {
            //make a group chat
        }
    }

    public function deleteRoom(string $roomId, Request $request) {
        $roomId = $request->route('roomId');

        DB::table('rooms')->where('id', '=', $roomId)->update([
            'deleted_at' => strval(time())
        ]);

    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
//      return response('redirect', 301)->header('Content-Location', 'localhost:8000');
        //return view('prod/lending');
        return response('redirect', 301)->header('Content-Location', '/');
    }

    public function saveMessage(Request $request) {
        $message_id = DB::table('messages')->insertGetId([
            'creator' => $request->session()->get('id'),
            'room' => $request->all()['roomId'],
            'text' => $request->all()['text'],
            'hash' => $request->all()['hash'],
        ]);
        //NewMessage::dispatch($message);
        return response()->json($message_id);
    }

    public function deleteMessage(string $msgHash, Request $request) {
        DB::table('messages')->where('hash', $msgHash)->update([
            'deleted_at' => strval(time())
        ]);
        /* Messages::where('hash', $msgHash)->update([
            'deleted_at' => time()
        ]); */
    }

    public function upload_avatar(Request $request) {
        function get_uniq_name($prefix) {
            return uniqid($prefix, true).bin2hex(random_bytes(16));
        }
        $currentUserId = $request->session()->get('id');

        $file_path = 'images/users/'.$currentUserId;
        $pic_name = $request->file('send_avatar')->getClientOriginalName();
        $pic_extension = strtolower($request->file('send_avatar')->getClientOriginalExtension());
        $pic_full_path = $request->file('send_avatar')->getRealPath();

        //$new_picSmall_name = get_uniq_name($pic_name);
        $new_picOrig_name = get_uniq_name($pic_name);
        $new_picSmall_full_path = $file_path.'/'.get_uniq_name($pic_name).'.webp';
        $new_picOrig_full_path = $file_path.'/'.$new_picOrig_name.'.'.$pic_extension;

        $check = Storage::disk('images')->exists($file_path);
        if (!$check) {
            Storage::disk('images')->makeDirectory($file_path);
        }

        $image = null;
        switch ($pic_extension) {
            case 'jpg':
                $image = imagecreatefromjpeg($pic_full_path);
                break;
            case 'jpeg':
                $image = imagecreatefromjpeg($pic_full_path);
                break;
            case 'webp':
                $image = imagecreatefromwebp($pic_full_path);
                break;
            case 'png':
                $image = imagecreatefrompng($pic_full_path);
                break;
            case 'gif':
                $image = imagecreatefromgif($pic_full_path);
                break;
        }
        $scaled = imagescale($image, 200);

        imagewebp($scaled, $new_picSmall_full_path);
        $request->file('send_avatar')->move($file_path, $new_picOrig_name.'.'.$pic_extension);

        DB::table('users')->where('id', '=', $currentUserId )->update([
            'pic_small' => $new_picSmall_full_path,
            'pic_orig' => $new_picOrig_full_path
        ]);

        $request->session()->put('pic_small', $new_picSmall_full_path);
        $request->session()->put('pic_orig', $new_picOrig_full_path);
        return response()->json(['path' => $new_picOrig_full_path]);
    }

    public function deleteAccount(Request $request) {
        DB::table('users')->where('id', '=', $request->session()->get('id'))->update([
            'deleted_at' => time()
        ]);
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response('redirect', 301)->header('Content-Location', '/');
    }

    public function update_user(Request $request) {
        $user_id = $request->session()->get('id');
        $user_login = $request->session()->get('login');
        $user_name = $request->session()->get('name');
        $data = $request->all();
        $counter = 0;
        if (array_key_exists('login', $data) && $data['login'] !== $user_login) {
            $check = DB::table('users')->where('login', $data['login'])->exists();
            if ($check) {
                return response($counter);
            } else {
                /* DB::table('users')->where('id', $user_id)->update([
                    'login' => $data['login']
                ]); */
                $request->session()->put('login', $data['login']);
                $counter = 1;
            }
        }

        if (array_key_exists('name', $data) && $data['name'] !== $user_name) {
            /* DB::table('users')->where('id', $user_id)->update([
                'name' => $data['name']
            ]); */
            $request->session()->put('name', $data['name']);
            $counter = ($counter == 0) ? 2 : 3;
        }

        switch ($counter) {
            case 1:
                DB::table('users')->where('id', $user_id)->update([
                    'login' => $data['login']
                ]);
            break;

            case 2:
                DB::table('users')->where('id', $user_id)->update([
                    'name' => $data['name']
                ]);
            break;

            case 3:
                DB::table('users')->where('id', $user_id)->update([
                    'login' => $data['login'],
                    'name' => $data['name']
                ]);
            break;
        }
        return response($counter);
    }

    public function service() {
        /*
        $login = "Marinn";
        $target = DB::table('users')->where('login', $login)->value('password');
        $newPassword = bcrypt($target);

        DB::table('users')->where('login', $login)->update(
            ['password' => $newPassword]
        );
        return view('chatEngine.success');
        */

        /*
        $allUsers = DB::table('users')->select('id', 'rooms')->get();
        $preOut = array();
        foreach($allUsers as $user) {
            if (is_null($user->rooms)) {
                continue;
            }
            foreach(unserialize($user->rooms) as $room) {
                if (in_array($room, array_keys($preOut))) {
                    $preOut[$room][] = $user->id;
                } else {
                    $preOut[$room] = [$user->id];
                }
            }
        }

        DB::table('rooms')->upsert(
            [
                ['id' => array_keys($preOut)[0], 'participants' => serialize(array_values($preOut)[0])],
                ['id' => array_keys($preOut)[1], 'participants' => serialize(array_values($preOut)[1])],
                ['id' => array_keys($preOut)[2], 'participants' => serialize(array_values($preOut)[2])]
            ],
            ['id'],
            ['participants']
        );
        return response()->json($preOut);
        */
        
        /*
        $id = 2;
        $allRooms = DB::table('users')->where('id', '=', $id)->value('rooms');
        $a = unserialize($allRooms);
        unset($a[3]);
        $roomsArr = serialize($a);
        DB::table('users')->where('id', '=', $id)->update(['rooms' => $roomsArr]);
        */

        //return response()->json($roomsObj);

        /*
        $userId = 2;
        $outData = array();
        $require_data = [];
        $rooms = DB::table('users')->where('login', 'Nana')->value('rooms');
        $roomsData = DB::table('rooms')->select('id', 'room_name', 'participants')->whereIn('id', unserialize($rooms))->get();
        foreach ($roomsData as $room) {
            if (is_null($room->room_name)) {
                $parts = unserialize($room->participants);
                foreach ($parts as $part) {
                    if ($part == $userId) {
                        continue;
                    } else {
                        $require_data[$part] = $room->id;
                    }
                }
            } else {
                $outData[$room->id] = $room->room_name;
            }
        }
        $dialogsNames = DB::table('users')->select('id', 'login')->whereIn('id', array_keys($require_data) )->get();
        foreach ($dialogsNames as $name) {
            $outData[$require_data[$name->id]] = $name->login;
        }
        return response()->json($outData);
        */

        //DB::table('rooms')->where('id', '=', 7)->delete();

        /*
        $room = Rooms::create([
            'room_name' => 'booba',
            'participants' => serialize([1, 6])
        ]);
        return response()->json($room->id);
        */

        //DB::table('rooms')->where('id', '=', 8)->delete();
        //$date_cr = '2023-01-01 00:00:00';
        //DB::table('users')->where('id', '=', 2)->update(['created_at' => $date_cr, 'updated_at' => $date_cr]);

        /*
        DB::table('users')->where('id', '=', 2)->update(['rooms' => serialize([1, 5, 6])]);
        DB::table('rooms')->where('id', '=', 9)->delete();
        DB::table('rooms')->where('id', '=', 10)->delete();
        DB::table('rooms')->where('id', '=', 11)->delete();
        DB::table('rooms')->where('id', '=', 12)->delete();
        DB::table('rooms')->where('id', '=', 13)->delete();
        DB::table('rooms')->where('id', '=', 14)->delete();
        DB::table('rooms')->where('id', '=', 15)->delete();
        DB::table('rooms')->where('id', '=', 16)->delete();
        DB::table('rooms')->where('id', '=', 17)->delete();
        DB::table('rooms')->where('id', '=', 18)->delete();
        DB::table('rooms')->where('id', '=', 19)->delete();
        DB::table('rooms')->where('id', '=', 20)->delete();
        */

        //DB::table('rooms')->where('id', '=', 25)->delete();
        //DB::table('rooms')->where('id', '=', 26)->delete();
        /* $id = 6;
        $all_participants = unserialize(DB::table('rooms')->where('id', '=', $id)->value('participants'));
        $usersData = DB::table('users')->select('id', 'login')->whereIn('id', $all_participants)->get();
        $ids = [];
        $names = [];
        $data = array();
        foreach ($usersData as $user) {
            $ids[] = $user->id;
            $names[] = $user->login;
        }
        $data[$ids[0]] = $names[1];
        $data[$ids[1]] = $names[0]; */
        //DB::table('rooms')->where('id', '=', 26)->update(['type' => 1]);

        /* DB::table('users')->where('id', '=', 2 )->update([
            'pic_small' => '/images/users/2/Nana.jpg6803b5f4996bd3.131674737ccfb904f0733f5268145c4c3d996c74.webp',
            'pic_orig' => '/images/users/2/Nana.jpg6803b5f4996a95.96127155d0aaa019e0365d6ac9473ed4b9e81040.jpg'
        ]); */

        //DB::table('users')->where('id', '=', 37 )->delete();


#########################


        /* $user_ids = [1, 3, 4, 26, 29, 30, 32, 34];
        foreach ($user_ids as $user_id) {
            $dialogs = [];
            $new_rooms = [];
            $rooms = DB::table('users')
            ->where('id', $user_id)
            ->value('rooms');

            $rooms_data = DB::table('rooms')
            ->select('id', 'participants')
            ->whereIn('id', unserialize($rooms))
            ->get();

            foreach ($rooms_data as $room) {
                $participants = unserialize($room->participants);
                $opponent = $participants[0] == $user_id ? $participants[1] : $participants[0];
                $login = DB::table('users')
                ->select('login')
                ->where('id', $opponent)
                ->first();
                if ($login) {
                    $dialogs[$opponent] = $room->id;
                    $new_rooms[] = $room->id;
                }
            }

            DB::table('users')
            ->where('id', $user_id)
            ->update([
                'rooms' => serialize($new_rooms),
                'dialogs' => serialize($dialogs),
            ]);
        }
        return response()->json(['ok']); */


//##########################

    }
}