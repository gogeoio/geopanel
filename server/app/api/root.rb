# Geopainel services
require "account"
require "services"

# GoGeo SDK
require "lib/gogeo"

require "logger/logger"

module Services
  class Root < Grape::API
    format :json
    default_format :json

    before do
      header "Content-Type", "application/json; charset=utf-8"
      header "Access-Control-Allow-Origin", "*"

      @logger = Services::Logger.instance.logger

      options = {
        api_url: AppConfig.gogeo.api_url,
        api_key: AppConfig.gogeo.api_key
      }

      begin
        if !@gogeo
          @gogeo ||= Services::GoGeo.new(options) 

          @databases ||= @gogeo.databases[:databases]
          @database_id ||= @databases[0][:id]
          @database_name ||= @databases[0][:database_name]
        end
      rescue Errno::ECONNREFUSED => e
        @logger.error("Conexão recusada com a plataforma")
      rescue Exception => e
        @logger.error(e.class.to_s + ": " + e.message)
      end

      @map_config ||= {
        host: AppConfig.gogeo.map_url,
        dbname: AppConfig.database_name
      }

    end

    get "/favicon.ico" do
      env["api.format"] = "binary"
      header "Content-Type", "image/png"

      dir = File.join(File.dirname(__FILE__), "../../..")
      ico = File.open(dir + "/client/geopainel-ui/favicon.ico", "r").read
      ico
    end

    mount Services::AccountAPI
    mount Services::ServicesAPI
  end
end