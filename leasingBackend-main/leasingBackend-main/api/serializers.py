from django.contrib.auth.models import User as UserModel
from rest_framework import serializers
from .models import ClientModel, LeasingItemModel, LeasingAgreementModel, ClosingLeasingModel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['username', 'password']


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientModel
        fields = '__all__'
        

class LeasingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeasingItemModel
        fields = '__all__'


class ClosingLeasingModel(serializers.ModelSerializer):
    class Meta:
        model = ClosingLeasingModel
        fields = '__all__'


class LeasingAgreementSerializer(serializers.ModelSerializer):
    payment = serializers.SerializerMethodField()
    class Meta:
        model = LeasingAgreementModel
        fields = '__all__'

    def get_payment(self, obj):
        payment_schedule = obj.payment_schedule
        financing_rate = obj.interest_rate / 100 
        total_price = obj.price
        agreement_term = obj.agreement_term

        if payment_schedule == 'Аннуитет':
            vehicle_redemption_price = total_price * (financing_rate + financing_rate / (pow(1 + financing_rate, agreement_term) - 1))
            return f'{vehicle_redemption_price:.2f}'
        elif payment_schedule == 'Гибрид':
            vehicle_redemption_price = total_price * (financing_rate + financing_rate / (pow(1 + financing_rate, agreement_term) - 1))
            return f'{vehicle_redemption_price:.2f}'
        elif payment_schedule == 'Градиент':
            vehicle_redemption_price = financing_rate * total_price
            part_of_payment = total_price / agreement_term
            return f'{(vehicle_redemption_price + part_of_payment):.2f}'
        elif payment_schedule == 'Проценты':
            return f'{(total_price * financing_rate):.2f}'
        return f'{(total_price / agreement_term + total_price * financing_rate):.2f}'
