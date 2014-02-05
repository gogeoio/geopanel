# encoding: utf-8

require "validations"
require "user"
require "date"

module Services

  include Util::Validations

  class AccountAPI < Grape::API

    before do
      header "Content-Type", "application/json; utf-8"

      @menus ||= JSON.parse(File.open(Dir.pwd + "/geopainel/menus.json", "r").read)
    end

    helpers do
      def logout
        token = cookies[:token]

        if token
          user = User.any_in(remember_tokens: [ token ]).first

          if user
            user.remember_tokens.delete(token)
            user.save
          end
        end

        cookies.delete(:token)
      end

      def get_user_with_token(token)
        User.any_in(remember_tokens: [ token ]).first
      end

    end

    get :session do
      begin
        {menus: @menus, user: get_user_with_token(cookies[:token]), gogeoConfig: @map_config}
      rescue Exception => e
        @logger.error("Error in account/session: " + e.message)
      end
    end

    get :logout do
      logout
    end

    params do
      requires :email, type: String, desc: "Email"
      requires :password, type: String, desc: "Password"
    end
    post :login do
      token = cookies[:token]

      if token
        user = get_user_with_token(token)

        if user
          return {menus: @menus, user: user, gogeoConfig: @map_config}
        end
      end

      logout

      email = params[:email]
      password = params[:password]

      user = User.find_by(email: email)

      if user && user.authenticate(password)
        token = User.new_remember_token
        # Expires in 2 months
        expires = DateTime.now >> 2
        cookies[:token] = {value: token, expires: expires.to_time}

        user.remember_tokens ||= []

        # Stores only 5 tokens per user
        if user.remember_tokens.length >= 5
          user.remember_tokens.shift
        end

        user.remember_tokens << token
        user.save

        return {menus: @menus, user: user, gogeoConfig: @map_config}
      else
        puts "error: sakdljfalsdkjf"
        error!("Invalid password", 400)
      end
    end
  end
end