    # encoding: utf-8

require "validations"

module Services

  include Util::Validations

  class MapAPI < Grape::API
    before do
      header "Content-Type", "application/json; utf-8"
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