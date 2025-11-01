from dateutil.relativedelta import relativedelta

class AnnuityCalculator:
    def get_table_content(self, leasing_agreement):
        table_content = []
        financing_rate = leasing_agreement.interest_rate / 100 # 0.03 

        agreement_date = leasing_agreement.agreement_date
        agreement_term = leasing_agreement.agreement_term
        total_price = leasing_agreement.price
        vehicle_redemption_price = total_price * (financing_rate + financing_rate / (pow(1 + financing_rate, agreement_term) - 1))
        amount_of_moratorium_days = leasing_agreement.moratorium

        tmp_total_price = total_price
        for i in range(agreement_term - 1):
            lease_payment = tmp_total_price * financing_rate
            table_content.append(
                {
                    'number': i + 1,
                    'date': (agreement_date + relativedelta(months=i + 1)).strftime('%d-%m-%Y'),
                    'lease_payment': f'{lease_payment:.2f}',
                    'payment_on_account': f'{(vehicle_redemption_price - lease_payment):.2f}',
                    'total_price': f'{vehicle_redemption_price:.2f}',
                    'vehicle_redemption_price': '–' if i + 1 < amount_of_moratorium_days else f'{(tmp_total_price - vehicle_redemption_price + lease_payment):.2f}'
                }
            )
            tmp_total_price -= vehicle_redemption_price - lease_payment

        lease_payment = tmp_total_price * financing_rate
        table_content.append(
            {
                'number': agreement_term,
                'date': (agreement_date + relativedelta(months=agreement_term)).strftime('%d-%m-%Y'),
                'lease_payment': f'{lease_payment:.2f}',
                'payment_on_account': f'{(vehicle_redemption_price - lease_payment):.2f}',
                'total_price': f'{vehicle_redemption_price:.2f}',
                'vehicle_redemption_price': f'{0.00:.2f}',
            }
        )

        return table_content
