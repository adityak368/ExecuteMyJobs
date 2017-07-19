package client;

import java.util.logging.Logger;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

public class CLIParser {

	private static final Logger mLogger = Logger.getLogger(CLIParser.class.getName());
	CommandLine commandLine;
    Options options;
    CommandLineParser parser;
    
	public CLIParser() {
		// TODO Auto-generated constructor stub
		parser = new DefaultParser();
		options = new Options();
        initCommandLineOptions();
	}
	
	private void initCommandLineOptions() {
		Option option_url = Option.builder("u")
	            .desc("Url of the server")
	            .longOpt("url")
	            .hasArg()
	            .build();
		Option option_help = Option.builder()
	            .desc("Usage Help")
	            .longOpt("help")
	            .build();
        options.addOption(option_url);
        options.addOption(option_help);
	}
	
	public boolean parseArgs(String [] args) {
        try
        {
            commandLine = parser.parse(options, args);
            
            if(commandLine.hasOption("help")) {
        	    String footer = "Execute My Jobs Client";
        	    HelpFormatter formatter = new HelpFormatter();
        	    formatter.printHelp( footer, options);   
            }
            
            return true;
        }
        catch (ParseException exception)
        {
        	mLogger.severe("Parse error: " + exception.getMessage());
            return false;
        }
	}
	
	public CommandLine getCommandLine() {
		return this.commandLine;
	}
}
