<?php
use App\Http\Controllers\chat;
use Illuminate\Support\Facades\File;
//use vendor\beyondcode\laravel-websockets\src\Facades\WebSocketRouter;
//WebSocketsRouter::webSocket('/my-websocket', \App\ws\MyCustomWebSocketHandler::class);

Route::get('/', [chat::class, 'index'])->name('/');
Route::get('/profile', [chat::class, 'profile']);
//Route::get('/storage', [chat::class, 'storage']);
Route::get('/8', function () {
    $filePath = public_path('8march/index.html');
        if (File::exists($filePath)) {
            return File::get($filePath);
        }
    }
);
Route::get('/logout', [chat::class, 'logout']);
Route::get('/init', [chat::class, 'initialize']);
Route::get('/search/{nickname}', [chat::class, 'search']);
Route::get('/dev', function () {return view('dev/m_lending');});
//Route::get('/service', [chat::class, 'service']);
//dd($_SERVER);
Route::post('/access', [chat::class, 'access']);
Route::post('/registration', [chat::class, 'registration']);
Route::post('/getMessages', [chat::class, 'getMessages']);
Route::post('/save', [chat::class, 'saveMessage']);
Route::post('/upload_pic', [chat::class, 'upload_avatar']);
Route::post('/newDialog', [chat::class, 'newDialog']);
Route::post('/update', [chat::class, 'update_user']);

Route::delete('/delete/{msgHash}', [chat::class, 'deleteMessage']);
Route::delete('/deleteProfile', [chat::class, 'deleteAccount']);
Route::delete('/deleteRoom/{roomId}', [chat::class, 'deleteRoom']);