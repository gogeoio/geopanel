module Util
  module Validations
    class MinSize < Grape::Validations::SingleOptionValidator
      def validate_param!(attr_name, params)
        param = params[attr_name]
        if param < @option
          throw :error, status: 400, message: "#{attr_name}: should be at least #{@option}"
        end
      end
    end

    class MaxSize < Grape::Validations::SingleOptionValidator
      def validate_param!(attr_name, params)
        param = params[attr_name]
        if param > @option
          throw :error, status: 400, message: "#{attr_name}: should be at most #{@option}"
        end
      end
    end

    class In < Grape::Validations::SingleOptionValidator
      def validate_param!(attr_name, params)
        if !@option.include?(params[attr_name])
          # params[attr_name] = @option[0]
          throw :error, status: 400, message: "#{attr_name}: should be #{@option.join(' or ')}"
        end
      end
    end
  end
end