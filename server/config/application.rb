$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), '..', 'app/api'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), '..', 'app/models'))
$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), '..', 'lib'))
$LOAD_PATH.unshift(File.dirname(__FILE__))

require 'grape'
require 'boot'

begin
  Bundler.require :default, ENV['RACK_ENV']

  Dir[File.expand_path('../initializers/*.rb', __FILE__)].each do |f|
    require f
  end

  Dir[File.expand_path('../../app/**/*.rb', __FILE__)].each do |f|
    require f
  end

  # Custom application configuration
  class AppConfig < Settingslogic
    source "#{File.dirname(__FILE__)}/config.yml"
    namespace ENV['RACK_ENV']
    load!
  end
rescue Interrupt
  puts "Interrupt"
end