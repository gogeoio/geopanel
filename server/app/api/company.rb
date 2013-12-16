# encoding: utf-8

require "validations"

module Services

  include Util::Validations

  class CompanyAPI < Grape::API
    before do
      header "Content-Type", "application/json; utf-8"
    end

    namespace :company do
      get :base do
        result = @gogeo.collections(@database_id, {name: "50k_empresas"})
        collection = result[:collections][0]
        
        collection_id = collection[:id]
        
        result = @gogeo.documents(@database_id, collection_id)

        base = {
          listId: collection[:collection_name],
          type: "BASE",
          description: collection[:collection_name],
          count: result[:total]
        }

        {base: base}
      end

      get :lists do
        result = @gogeo.collections(@database_id)
        collections = result[:collections]
        collections
      end

    end
  end
end