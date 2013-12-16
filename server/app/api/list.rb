# encoding: utf-8

require "validations"

module Services

  include Util::Validations

  class ListAPI < Grape::API
    before do
      header "Content-Type", "application/json; utf-8"
    end

    namespace :lists do

      get "/" do
        result = @gogeo.collections(@database_id)
        total = result[:total]
        collections = result[:collections]
        {total: total, rows: collections}
      end

      # -------------------------------------------------------------- #

      params do
        requires :id, type: String, desc: "List id"
        optional :page, default: 1, type: Integer
        optional :limit, default: 10, type: Integer
        optional :location, type: String, desc: "Filter by location"
        optional :location_fields, type: Array, default: [ "city", "state", "neighborhood", "logradouro" ], desc: "Filtered location fields"
        optional :cnae, type: String, desc: "Filter by CNAE"
        optional :cnae_fields, type: Array, default: [ "cnae_primario", "cnae_p_label" ], desc: "Filtered cnae fields"
      end
      get ":id" do
        collection_id = params[:id]

        if !params[:location] || params[:location].empty?
          params[:location] = "*"
        end

        query = {
          query: {
            query_string: {
              fields: params[:location_fields],
              query: params[:location]
            }
          }
        }

        if params[:cnae] && !params[:cnae].empty?
          filter = {}
          filter[:and] = []
          filter[:and] << query

          cnae_filter = {
            query: {
              query_string: {
                query: params[:cnae],
                fields: params[:cnae_fields]
              }
            }
          }

          filter[:and] << cnae_filter
          query = {filter: filter}
        end

        options = {
          page: params[:page],
          limit: params[:limit]
        }

        @logger.debug("(1)")
        @logger.debug(JSON.pretty_generate(query))

        result = @gogeo.documents_advanced_query(@database_id, collection_id, JSON.generate(query), options)
        documents = result[:documents]

        total = result[:total]
        limit = result[:limit]
        pages = total / limit

        {total: total, pages: pages, rows: documents}
      end
    end

    namespace :maps do
      desc "Map filter"
      params do
        requires :id, type: String, desc: "List id"
        optional :page, type: Integer, default: 1
        optional :limit, type: Integer, default: 10
        optional :query, type: String, default: "*"
      end
      get "/list/filter" do

        if !params[:query] || params[:query].empty?
          params[:query] = "*"
        end

        query = {
          query: {
            query_string: {
              query: params[:query]
            }
          }
        }

        @logger.debug("(2)")
        @logger.debug(JSON.pretty_generate(query))

        options = {
          page: params[:page],
          limit: params[:limit]
        }

        result = @gogeo.documents_advanced_query(@database_id, params[:id], JSON.generate(query), options)

        documents = result[:documents]

        {total: result[:total], rows: documents}
      end
    end

  end
end