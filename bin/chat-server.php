<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use WS\PusherApp;
use Ratchet\Http\OriginCheck;
//use Ratchet\Wamp\WampServer;
    //xdebug_connect_to_client();
    require dirname(__DIR__) . '/vendor/autoload.php';

    $loop = React\EventLoop\Factory::create();
    $pusher = new PusherApp();

    /* $wsServer = new OriginCheck(new WsServer($pusher));
    $httpserv = new HttpServer($wsServer);
    $server = IoServer::factory(
        $httpserv,
        8080
    );

    $server->run(); */


    //$context = new React\ZMQ\Context($loop);
    //$pull = $context->getSocket(ZMQ::SOCKET_PULL);
    //$pull->bind('tcp://127.0.0.1:5555');
    //$pull->on('message', array($pusher, 'onBlogEntry'));

    $webSock = new React\Socket\Server('127.0.0.1:8080', $loop);
    $server = new Ratchet\Server\IoServer(
        new HttpServer(
            new WsServer(
                //new WampServer(
                $pusher
                //)
            )
        ),
        $webSock
    );

    $loop->run();
    //server->run();
?>
