from dateutil.relativedelta import relativedelta

class InterestCalculator:
    def get_table_content(self, leasing_agreement):
        table_content = []
        financing_rate = leasing_agreement.interest_rate / 100 # 0.03 

        agreement_date = leasing_agreement.agreement_date
        agreement_term = leasing_agreement.agreement_term
        total_price = leasing_agreement.price
        amount_of_moratorium_days = leasing_agreement.moratorium

        for i in range(agreement_term - 1):
            lease_payment = total_price * financing_rate
            table_content.append(
                {
                    'number': i + 1,
                    'date': (agreement_date + relativedelta(months=i + 1)).strftime('%d-%m-%Y'),
                    'lease_payment': f'{lease_payment:.2f}',
                    'payment_on_account': 0,
                    'total_price': f'{lease_payment:.2f}',
                    'vehicle_redemption_price': '–' if i + 1 < amount_of_moratorium_days else f'{total_price:.2f}',
                }
            )

        lease_payment = total_price * financing_rate
        table_content.append(
            {
                'number': agreement_term,
                'date': (agreement_date + relativedelta(months=agreement_term)).strftime('%d-%m-%Y'),
                'lease_payment': f'{lease_payment:.2f}',
                'payment_on_account': f'{total_price:.2f}',
                'total_price': f'{lease_payment + total_price:.2f}',
                'vehicle_redemption_price': f'{0.00:.2f}',
            }
        )

        return table_content