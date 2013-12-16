# encoding: utf-8

require "validations"

module Services

  include Util::Validations

  class UserAPI < Grape::API
    before do
      header "Content-Type", "application/json; utf-8"
    end

    namespace :users do
      get do
        {users: []}
      end

      get "invite/pending" do
        result = {
          size: 0,
          invites: []
        }
        result
      end

    end

  end
end