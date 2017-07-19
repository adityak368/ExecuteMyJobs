package client;

import java.util.logging.Logger;

import io.socket.client.IO;

public class Main {

	private static final Logger mLogger = Logger.getLogger(Main.class.getName());
	/**
	 * @param args
	 */
	public static void main(String[] args) {

		ConfigLoader configsLoader = new ConfigLoader();
		if (!configsLoader.loadConfigs())
			System.exit(1);

		CLIParser cliParser = new CLIParser();
		if (!cliParser.parseArgs(args))
			System.exit(1);
		
		if (cliParser.getCommandLine().hasOption("url")) {
			String url = cliParser.getCommandLine().getOptionValue("url");
			IO.Options opts = new IO.Options();
			opts.query = "password=" + configsLoader.getPassword() + "&name=" + configsLoader.getName();
			opts.reconnection = true;
			opts.reconnectionDelay = 1000;
			opts.reconnectionDelayMax = 5000;
			opts.reconnectionAttempts = 1000;
			SocketIOClient client = new SocketIOClient(url, opts, configsLoader);
			client.connect();
		} else {
			mLogger.severe("Parse error: Url Not Found");
		}
	}

}