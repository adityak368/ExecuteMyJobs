package handlers;

import java.util.logging.Logger;

import client.ConfigLoader;
import io.socket.client.Socket;

public class SocketIOClientPauseJobHandler implements IEventHandler {

	private Socket mSocket;
	private final String mEventId;
	private ConfigLoader mConfigLoader;
	private static final Logger mLogger = Logger.getLogger(SocketIOClientPauseJobHandler.class.getName());
	
	@Override
	public void call(Object... args) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void emitMsg(Object obj) {
		// TODO Auto-generated method stub
		
	}

	public SocketIOClientPauseJobHandler(Socket socket, ConfigLoader configLoader, String eventId) {
		// TODO Auto-generated constructor stub
		this.mSocket = socket;
		this.mEventId = eventId;
		this.mConfigLoader = configLoader;
	}
	
}
