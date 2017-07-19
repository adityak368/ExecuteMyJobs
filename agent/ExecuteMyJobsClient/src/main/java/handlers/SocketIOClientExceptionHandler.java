package handlers;

import java.util.logging.Logger;

import io.socket.client.Socket;

public class SocketIOClientExceptionHandler implements IEventHandler {
	private Socket mSocket;
	private final String mEventId;
	private static final Logger mLogger = Logger.getLogger(SocketIOClientExceptionHandler.class.getName());
	
	@Override
	public void call(Object... args) {
		// TODO Auto-generated method stub
		if(args.length>0)
			mLogger.info("Exception! " + args[0].toString());
		else 
			mLogger.info("Exception! ");
		
		mSocket.disconnect();
	}

	public SocketIOClientExceptionHandler(Socket socket, String eventId) {
		// TODO Auto-generated constructor stub
		this.mSocket = socket;
		this.mEventId = eventId;
	}

	@Override
	public void emitMsg(Object obj) {
		// TODO Auto-generated method stub
		
	}

}
