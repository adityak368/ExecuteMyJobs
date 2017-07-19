package handlers;

import java.util.logging.Logger;

import io.socket.client.Socket;

public class SocketIOClientErrorHandler implements IEventHandler {

	private Socket mSocket;
	private final String mEventId;
	private static final Logger mLogger = Logger.getLogger(SocketIOClientErrorHandler.class.getName());
	
	@Override
	public void call(Object... args) {
		// TODO Auto-generated method stub
		if(args.length>0)
			mLogger.info("Error! " + args[0].toString());
		else 
			mLogger.info("Error! ");
		
	}

	public SocketIOClientErrorHandler(Socket socket, String eventId) {
		// TODO Auto-generated constructor stub
		this.mSocket = socket;
		this.mEventId = eventId;
	}
	
	@Override
	public void emitMsg(Object obj) {
		// TODO Auto-generated method stub
		
	}

}
