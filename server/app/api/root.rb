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
        api_key: "84ba79ce-3702-427a-816f-efa3fa76e0b1"
      }

      if !@gogeo
        @gogeo ||= Services::GoGeo.new(options) 

        @databases ||= @gogeo.databases[:databases]
        @database_id ||= @databases[0][:id]
        @database_name ||= @databases[0][:database_name]

      end
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