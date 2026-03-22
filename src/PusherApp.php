<?php
namespace WS;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use DS\Set;

class PusherApp implements MessageComponentInterface {
    const MSG_WELCOME     = 0;  //server -> client
    //const MSG_PREFIX      = 1;
    //const MSG_CALL        = 2;
    //const MSG_CALL_RESULT = 3;
    //const MSG_CALL_ERROR  = 4;
    const MSG_NEW_ROOM    = 5;  //client <-> server
    const MSG_DEL_ROOM    = 6;  //client <-> server
    const MSG_PUBLISH     = 7;  //client -> server
    const MSG_EVENT       = 8;  //client <- server
    const SUB_STATUS      = 9;  //client <- server
    const INITIALIZE      = 11; //client -> server
    const DONE            = 12; //client <- server


                        /* Closed interface */


    protected $online;
    protected $subs_on_rooms;
    protected $subs_on_users;
    protected $ssid_to_id;
    protected $conn_to_ssid;

    protected function sub_on_room(ConnectionInterface $conn, $room) {
        
    }


                        /* Opened interface */


    public function __construct() {
        $this->online = array();
        $this->subs_on_users = array();
        $this->subs_on_rooms = array();
        $this->ssid_to_id = array();
        $this->conn_to_ssid = new \SplObjectStorage;
        //$this->requred_ids = array();
    }

    public function onOpen(ConnectionInterface $conn) {
        $new_session = str_replace('.', '', uniqid(mt_rand(), true));
        $this->conn_to_ssid->offsetSet($conn, $new_session);
        $msg = [static::MSG_WELCOME, $new_session, 'X', 'CUSTOM'];
        $conn->send(json_encode($msg));
    }

    public function onMessage(ConnectionInterface $conn, $msg) {
        $request_data = json_decode($msg);
        switch ($request_data[0]) {
            case static::MSG_NEW_ROOM: //request_data: [MSG_CODE, room_id, sender, recipient]
                $room_id = intval($request_data[1]);
                $sender = $request_data[2];
                $recipient = $request_data[3];
                $recipient_devices = null;
                $room_data = [
                    static::MSG_NEW_ROOM,
                    $room_id,
                    $sender,
                ];

                $this->online[$sender->id]['rooms']->add($room_id);
                $this->online[$sender->id]['users']->add($recipient->id);

                //make a new room subscription without check bc it coudn't exist
                //and subscribe sender on it
                $this->subs_on_rooms[$room_id] = new \SplObjectStorage;
                $this->subs_on_rooms[$room_id]->offsetSet($conn);

                //subscribe sender on recipient's status update
                if (array_key_exists($recipient->id, $this->subs_on_users)) {
                    $this->subs_on_users[$recipient->id]->offsetSet($conn);
                } else {
                    $this->subs_on_users[$recipient->id] = new \SplObjectStorage;
                    $this->subs_on_users[$recipient->id]->offsetSet($conn);
                }

                //determine is user online or not
                if (array_key_exists($recipient->id, $this->online) && $this->online[$recipient->id]['connections']->count() > 0) {
                    $recipient_devices = $this->online[$recipient->id]['connections'];

                    $this->online[$recipient->id]['rooms']->add($room_id);
                    $this->online[$recipient->id]['users']->add($sender->id);

                    if (!array_key_exists($sender->id, $this->subs_on_users)) {
                        $this->subs_on_users[$sender->id] = new \SplObjectStorage;
                    }

                    //subscribe recipient's devices on recently created room
                    foreach ($recipient_devices as $connection) {
                        $connection->send(json_encode($room_data));
                        $this->subs_on_rooms[$room_id]->offsetSet($connection);
                        $this->subs_on_users[$sender->id]->offsetSet($connection);
                    }
                    $conn->send(json_encode([static::SUB_STATUS, $recipient->id, true]));
                }
            break;

            case static::MSG_DEL_ROOM:
                $room_id = intval($request_data[1]);
                $sender_id = intval($request_data[2]);
                $recipient_id = intval($request_data[3]);
                $recipient_devices = null;

                unset($this->subs_on_rooms[$room_id]);

                $this->online[$sender_id]['rooms']->remove($room_id);
                $this->online[$sender_id]['users']->remove($recipient_id);
                foreach($this->online[$sender_id]['connections'] as $connection) {
                    $this->subs_on_users[$recipient_id]->offsetUnset($connection);
                }

                if (array_key_exists($recipient_id, $this->online) && $this->online[$recipient_id]['connections']->count() > 0) {
                    $recipient_devices = $this->online[$recipient_id]['connections'];

                    $this->online[$recipient_id]['rooms']->remove($room_id);
                    $this->online[$recipient_id]['users']->remove($sender_id);

                    foreach ($recipient_devices as $connection) {
                        $connection->send(json_encode([static::MSG_DEL_ROOM, $room_id]));
                        $this->subs_on_users[$sender_id]->offsetUnset($connection);
                    }
                }
               
            break;

            case static::MSG_PUBLISH: //$request_data = [MSG_CODE, room_id, data_object, [sender_ssid]]
                $msg = [static::MSG_EVENT, $request_data[1], $request_data[2]];
                foreach ($this->subs_on_rooms[intval($request_data[1])] as $connection) {
                    if ($connection !== $conn) {
                        $connection->send(json_encode($msg));
                    }
                }
                //code
            break;

            case static::INITIALIZE: //$request_data = [MSG_CODE, own_id, id_list, rooms_list]
                //subscribe connected user on given rooms
                if ($request_data[3]) {
                    foreach ($request_data[3] as $room_id) {
                        $room = intval($room_id);
                        if (array_key_exists($room, $this->subs_on_rooms)) {
                            if ($this->subs_on_rooms[$room]->offsetExists($conn)) {
                                return;
                            } else {
                                $this->subs_on_rooms[$room]->offsetSet($conn);
                            }
                        } else {
                            $this->subs_on_rooms[$room] = new \SplObjectStorage;
                            $this->subs_on_rooms[$room]->offsetSet($conn);
                        }
                    }
                }

                //subscribe connected user on given users
                if ($request_data[2]) {
                    foreach ($request_data[2] as $id) {
                        $user = intval($id);
                        if (array_key_exists($user, $this->subs_on_users)) {
                            if ($this->subs_on_users[$user]->offsetExists($conn)) {
                                return;
                            } else {
                                $this->subs_on_users[$user]->offsetSet($conn);
                            }
                        } else {
                            $this->subs_on_users[$user] = new \SplObjectStorage;
                            $this->subs_on_users[$user]->offsetSet($conn);
                        }   
                    }
                }
                //make the connected user know about other people
                if ($request_data[2]) {
                    $out = array(); //could use DS\Vector instead list
                    foreach ($request_data[2] as $id) {
                        $out[$id] = (array_key_exists($id, $this->online) && $this->online[$id]['connections']->count() > 0) ? true : false;
                    }
                    $msg = [static::DONE, $out];
                    $conn->send(json_encode($msg));
                }


                //attach local session_id to real user_id
                $this->ssid_to_id[$this->conn_to_ssid->offsetGet($conn)] = $request_data[1];
                
                //mark the new client as being online since this moment
                if (array_key_exists($request_data[1], $this->online)) {
                    $this->online[$request_data[1]]['connections']->add($conn);
                } else {
                    $this->online[$request_data[1]] = array(
                        'connections' => new Set([$conn])
                    );
                }

                if ($this->online[$request_data[1]]['connections']->count() == 1) {
                    $this->online[$request_data[1]]['users'] = new Set($request_data[2]);
                    $this->online[$request_data[1]]['rooms'] = new Set($request_data[3]);

                    //make other people know about the connected user
                    if (array_key_exists($request_data[1], $this->subs_on_users)) {
                        foreach ($this->subs_on_users[$request_data[1]] as $connection) {
                            $connection->send(json_encode([static::SUB_STATUS, $request_data[1], true]));
                        }
                    }
                }
            break;
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $current_ssid = $this->conn_to_ssid->offsetGet($conn);
        $current_id = $this->ssid_to_id[$current_ssid];

        //unsub disconnected user from status updates
        foreach($this->online[$current_id]['users'] as $id) {
            if (is_int($id)) {
                $this->subs_on_users[$id]->offsetUnset($conn);
            } else {
                //throw error
            }
        }

        foreach($this->online[$current_id]['rooms'] as $id) {
            if (is_int($id)) {
                $this->subs_on_rooms[$id]->offsetUnset($conn);
            } else {
                //throw error
            }
        }

        //clear session_id to real id association
        unset($this->ssid_to_id[$current_ssid]);

        //clear connection
        $this->conn_to_ssid->offsetUnset($conn);

        //clear online array
        $this->online[$current_id]['connections']->remove($conn);

        //clear $requred_ids if it necessary
        //and make other people know about online status changing
        if ($this->online[$current_id]['connections']->count() == 0) {
            $this->online[$current_id]['users'] = null;
            $this->online[$current_id]['rooms'] = null;
            if (array_key_exists($current_id, $this->subs_on_users)) {
                foreach ($this->subs_on_users[$current_id] as $connection) {
                    $connection->send(json_encode([static::SUB_STATUS, $current_id, false]));
                }
            }
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        //$conn->close();
    }
}