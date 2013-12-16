# encoding: utf-8

require "validations"

module Services

  include Util::Validations

  class AccountAPI < Grape::API

    before do
      header "Content-Type", "application/json; utf-8"
    end

    namespace :account do
      get :session do
        begin
          menus = File.open(Dir.pwd + "/geopainel/menus.json", "r").read
          menus = JSON.parse(menus)
          user = {
            name: "Roberto Rodrigues Junior",
            email: "robertogyn19@gmail.com",
            profile: "ADMIN",
            account: "SuperRoot"
          }

          {menus: menus, user: user}
        rescue Exception => e
          @logger.error("Error in account/session: " + e.message)
        end
      end
    end

  end
end