#\ -p 8800 -s Puma
require File.expand_path('../config/environment', __FILE__)

ENV['RACK_ENV'] ||= 'development'

if ENV['RACK_ENV'] == 'development'
  # development startup code only
  require 'rack/aggregate'
  use Rack::Aggregate
end

use Rack::Static,
  urls: [
        "/js",
        "/css",
        "/libs",
        "/logos",
        "/views",
        "/images",
        "/styles",
        "/cuia.png",
        "/font-awesome",
        "/public/js",
        "/public/logos",
        "/public/cuia.png",
        "/public/favicon.ico",
        "/public/not-authorized.html"
    ],
  root: [File.expand_path('../../client/geopainel-ui', __FILE__)],
  index: "/index.html"

# STDERR.reopen "/dev/null", "a"

run Services::Root

Services::Logger.instance.logger.info("")
Services::Root.routes.each do |api|
  method = api.route_method.ljust(10)
  path = api.route_path
  Services::Logger.instance.logger.info(" #{method} #{path}")
end
