require "company"
require "list"
require "map"
require "user"

require "logger/logger"

module Services
  class ServicesAPI < Grape::API

    before do
      if !signed_in?
        @logger.debug("Redirecting to /login")
        redirect "/#/login"
      end
    end
    
    helpers do
      def signed_in?
        token = cookies[:token]

        token != nil
      end
    end

    mount Services::CompanyAPI
    mount Services::ListAPI
    mount Services::MapAPI
    mount Services::UserAPI

    end
end