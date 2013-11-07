#\ -p 8080
require File.expand_path('../config/environment', __FILE__)

ENV['RACK_ENV'] ||= 'development'

if ENV['RACK_ENV'] == 'development'
  # development startup code only
  require 'rack/aggregate'
  use Rack::Aggregate
end

use Rack::ServerPages do |config|
  dir = File.expand_path('../../client', __FILE__)
  config.view_path = dir
end

run Services::Root
