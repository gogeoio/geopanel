# encoding: utf-8

require "validations"

module Services

  include Util::Validations

  class Companies < Grape::API
    version   'v1', :using => :path

    before do
      header "Content-Type", "application/json; utf-8"
    end

    helpers do
      def get_resource
        resource = RestClient::Resource.new(
          "http://" + AppConfig.gogeo_api,
          :headers => { :accept => :json, :content_type => :json },
          :user => AppConfig.apikey, :password => ""
        )
        resource
      end
    end

    namespace "companies" do
      
      desc "Find document in GoGeo"
      params do
        requires :q, type: String, desc: "Term to search"
        optional :field, type: String, default: "nm_nng", desc: "Field to match"
        optional :page, type: Integer, min_size: 1, default: 1
        optional :limit, type: Integer, min_size: 1, max_size: 30, default: 10
      end
      get "/find" do
        page = params[:page]
        limit = params[:limit]

        url = ["v1/databases", AppConfig.database_id, "collections", AppConfig.collection_id, "documents"]
        url = url.join("/") + "?q=" + URI::encode(params[:field] + ":*" + params[:q] + "*")

        url = url + "&page=" + page.to_s + "&limit=" + limit.to_s

        resource = get_resource
        begin
          response = resource[url].get().force_encoding("utf-8")
          header "Pagination-Limit", response.headers[:pagination_limit]
          header "Pagination-Offset", response.headers[:pagination_offset]
          header "Pagination-TotalCount", response.headers[:pagination_totalcount]
          
          response = JSON.parse(response)
        rescue URI::InvalidURIError => e
          error!(e, 400)
        rescue Exception => e
          error!(e, 500)
        end

        response
      end

      desc "List documents in GoGeo"
      params do
        optional :page, type: Integer, min_size: 1, default: 1
        optional :limit, type: Integer, min_size: 1, max_size: 30, default: 10
        optional :q, type: String, desc: ""
      end
      get "/list" do
        page = params[:page]
        limit = params[:limit]

        url = ["v1/databases", AppConfig.database_id, "collections", AppConfig.collection_id, "documents"]
        url = url.join("/") + "?page=" + page.to_s + "&limit=" + limit.to_s

        if params[:q]
          url = url + "&q=" + URI::encode(params[:q])
        end

        resource = get_resource
        begin
          response = resource[url].get().force_encoding("utf-8")
          header "Pagination-Limit", response.headers[:pagination_limit]
          header "Pagination-Offset", response.headers[:pagination_offset]
          header "Pagination-TotalCount", response.headers[:pagination_totalcount]
          
          response = JSON.parse(response)
        rescue URI::InvalidURIError => e
          error!(e, 400)
        rescue Exception => e
          error!(e, 500)
        end

        response
      end
      desc "Find a document by id"
      params do
        requires :id, type: String, desc: "Document id"
      end
      get "/:id" do
        url = ["v1/databases", AppConfig.database_id, "collections", AppConfig.collection_id, "documents", params[:id]].join("/")

        resource = get_resource
        begin
          response = resource[url].get().force_encoding("utf-8")
          response = JSON.parse(response)
        rescue URI::InvalidURIError => e
          error!(e, 400)
        rescue Exception => e
          error!(e, 500)
        end

        response
      end
    end
  end
end