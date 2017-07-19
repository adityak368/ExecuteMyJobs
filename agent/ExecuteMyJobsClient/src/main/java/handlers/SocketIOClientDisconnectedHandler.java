package handlers;

import java.util.logging.Logger;

import io.socket.client.Socket;

public class SocketIOClientDisconnectedHandler implements IEventHandler{

	private Socket mSocket;
	private final String mEventId;
	private static final Logger mLogger = Logger.getLogger(SocketIOClientDisconnectedHandler.class.getName());
	
	@Override
	public void call(Object... args) {
		// TODO Auto-generated method stub
		mLogger.info("Agent Disconnected");
	}
	
	public SocketIOClientDisconnectedHandler(Socket socket, String eventId) {
		// TODO Auto-generated constructor stub
		this.mSocket = socket;
		this.mEventId = eventId;
	}

	@Override
	public void emitMsg(Object obj) {
		// TODO Auto-generated method stub
		mSocket.emit(mEventId, obj);
	}

}
