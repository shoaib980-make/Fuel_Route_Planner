from rest_framework import serializers


class RouteRequestSerializer(serializers.Serializer):
    start  = serializers.CharField(max_length=300)
    finish = serializers.CharField(max_length=300)

    def validate_start(self, v):
        if len(v.strip()) < 3:
            raise serializers.ValidationError("Start location is too short.")
        return v.strip()

    def validate_finish(self, v):
        if len(v.strip()) < 3:
            raise serializers.ValidationError("Finish location is too short.")
        return v.strip()

    def validate(self, data):
        if data["start"].lower() == data["finish"].lower():
            raise serializers.ValidationError("Start and finish must be different.")
        return data
