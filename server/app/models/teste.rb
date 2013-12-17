# require "bundler/setup"
# require "mongoid"

# ENV["RACK_ENV"] = "development"
# Mongoid.load! "../../config/mongoid.yml"

# require "./user"

# user = User.any_in(remember_tokens: [ "q7BdQDWxO-d8hkRoKjO26Q" ]).first

# puts "user: " + user.inspect