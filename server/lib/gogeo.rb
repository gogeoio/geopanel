require "bundler/setup"
require "./logger/logger"
require 'open-uri'

module Services
  class GoGeo
    def initialize(options)
      @logger = Services::Logger.instance.logger

      defaults = {
        api_url: "https://api.gogeo.io/v1"
      }

      options = defaults.merge(options)

      @rest = RestClient::Resource.new(
        options[:api_url],
        {
          headers: { accept: :json, content_type: :json },
          user: options[:api_key],
          password: ""
        },
        timeout: 10,
        open_timeout: 10
      )
    end

    def databases(options={})
      url = "/databases"
      url = add_options_page(url, options)

      do_request(url, "databases", "get")
    end

    def collections(database_id, options={})
      if !database_id
        nil
      end

      url = "/databases/" + database_id.to_s +  "/collections"
      url = add_options_page(url, options)

      # Find by name
      if options.has_key?(:name)
        url = url + "&name=" + options[:name]
      end

      do_request(url, "collections", "get")
    end

    def collection(database_id, collection_id)
      url = "/databases/" + database_id.to_s + "/collections/" + collection_id.to_s

      collection = @rest[url].get

      do_request(url, "collection", "get")
    end

    def documents(database_id, collection_id, options={})
      url = "/databases/" + database_id.to_s + "/collections/" + collection_id.to_s + "/documents"

      url = add_options_page(url, options)

      if options[:q]
        url = url + "&q=" + URI::encode(options[:q])
      end

      do_request(url, "documents", "get")
    end

    def documents_advanced_query(database_id, collection_id, query, options={})
      url = "/databases/" + database_id.to_s + "/collections/" + collection_id.to_s + "/documents/query"

      url = add_options_page(url, options)

      do_request(url, "documents", "post", {q: query})
    end

    private
      def add_options_page(url, options)
        defaults = {
          page: 1,
          limit: 10
        }

        options = defaults.merge(options)

        page = options[:page]
        limit = options[:limit]

        if !url.match(/(.*)\?(.*)/i)
          url = url + "?"
        end

        if page
          url = url + "page=" + page.to_s + "&"
        end

        if limit
          url = url + "limit=" + limit.to_s
        end

        url
      end

      def do_request(url, name, method, params={})
        begin
          if method == "post"
            response = @rest[url].post params
          else
            response = @rest[url].get
          end
          
          limit = response.headers[:pagination_limit].to_i
          offset = response.headers[:pagination_offset].to_i
          total_count = response.headers[:pagination_totalcount].to_i

          resource = JSON.parse(response, symbolize_names: true)

          result = {limit: limit, offset: offset, total: total_count}
          result[name.to_sym] = resource
          result
        rescue OpenSSL::SSL::SSLError => e
          raise StandardError.new(e.class.to_s + ": " + e.message)
        rescue Exception => e
          @logger.error(e.class.to_s + ": Error in execute #{method} request #{name} " + e.message)
          @logger.error("url: " + url)
          nil
        end
      end

    # end private

  end
end