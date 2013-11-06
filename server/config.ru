#\ -p 8080
require File.expand_path('../config/environment', __FILE__)

ENV['RACK_ENV'] ||= 'development'

if ENV['RACK_ENV'] == 'development'
  # development startup code only
  # require 'rack/aggregate'
  # use Rack::Aggregate
end

use Rack::TryStatic,
  :root => File.expand_path('../../client', __FILE__),
  :urls => %w[/], :try => ['.html', 'index.html', '/index.html']

run Services::Root