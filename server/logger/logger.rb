require "logging"
require "singleton"

# here we setup a color scheme called 'bright'
Logging.color_scheme( 'bright',
  :levels => {
    :info  => :green,
    :warn  => :yellow,
    :error => :red,
    :fatal => [:white, :on_red]
  },
  :date => :blue,
  :logger => :cyan,
  :message => :black
)

module Services
  class Logger
    include Singleton

    attr_accessor :logger

    def initialize
      if AppConfig.has_key?("logger") && AppConfig.logger.has_key?("name")
        @logger = Logging.logger[AppConfig.logger.name]
      else
        @logger = Logging.logger['logger']
      end

      if AppConfig.has_key?("logger") && AppConfig.logger.has_key?("level")
        @logger.level = AppConfig.logger.level
      else
        @logger.level = :info
      end

      if AppConfig.has_key?("logger") && AppConfig.logger.has_key?("appenders")
        if AppConfig.logger.appenders.has_key?("stdout")
          @logger.add_appenders(
            Logging.appenders.stdout(
              layout: Logging.layouts.pattern(
                pattern: "[%d] %-5l: (%c) \-\-> %m\n",
                date_pattern: "%d\/%m\/%Y %H:%M:%S",
                color_scheme: 'bright'
              )
            )
          )
        end

        if AppConfig.logger.appenders.has_key?("file")
          @logger.add_appenders(
            Logging.appenders.file(
              AppConfig.logger.appenders.file,
              layout: Logging.layouts.pattern(
                pattern: '[%d] %-5l: %m %L\n',
                date_pattern: "%d\/%m\/%Y %H:%M:%S"
              )
            )
          )
        end
      end

      @logger
    end
  end
end