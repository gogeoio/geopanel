require "mongoid"

Mongoid.load! "config/mongoid.yml"

module Mongoid
  module Document
    def as_json(options={})
      attrs = super(options)
      attrs["id"] = attrs["_id"].to_s

      new_attrs = Hash.new

      attrs.each do |entry|
        key = entry[0]
        value = entry[1]

        if key.match("_id") && value.class.to_s.match("ObjectId")
          value = value.to_s
        end

        new_attrs[key] = value
      end

      new_attrs.delete("_id")

      new_attrs
    end
  end
end