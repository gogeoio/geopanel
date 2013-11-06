require 'companies'

module Services
  class Root < Grape::API
    format :json
    default_format :json

    before do
      header "Content-Type", "application/json; charset=utf-8"
    end

    get "/favicon.ico" do
      env["api.format"] = "binary"
      header "Content-Type", "image/png"

      dir = File.join(File.dirname(__FILE__), "../../..")
      ico = File.open(dir + "/favicon.png", "r").read
      ico
    end

    mount Services::Companies
  end
end