#\ -p 8080 -s Puma
require File.expand_path('../config/environment', __FILE__)

ENV['RACK_ENV'] ||= 'development'

if ENV['RACK_ENV'] == 'development'
  # development startup code only
  require 'rack/aggregate'
  use Rack::Aggregate
end

# require 'rack-server-pages'
use Rack::Static,
  urls: [ "/css", "/images", "/js", "/libs", "/views", "/index.html", "favicon.ico" ],
  root: File.expand_path('../../client/geopainel-ui', __FILE__),
  index: "index.html"

# STDERR.reopen "/dev/null", "a"

# use Rack::ServerPages do |config|
#   dir = File.expand_path('../../client/geopainel-ui', __FILE__)
#   config.view_path = dir
# end

run Services::Root

Services::Logger.instance.logger.info("")
Services::Root.routes.each do |api|
  method = api.route_method.ljust(10)
  path = api.route_path
  Services::Logger.instance.logger.info(" #{method} #{path}")
end
