from dateutil.relativedelta import relativedelta

class GradientCalculator:
    def get_table_content(self, leasing_agreement):
        table_content = []
        financing_rate = leasing_agreement.interest_rate / 100 # 0.06 

        agreement_date = leasing_agreement.agreement_date
        agreement_term = leasing_agreement.agreement_term
        total_price = leasing_agreement.price
        vehicle_redemption_price = financing_rate * total_price
        part_of_payment = total_price / agreement_term
        amount_of_moratorium_days = leasing_agreement.moratorium

        body_share = [] 
        if agreement_term == 12:
            body_share = [0.333333, 0.333333, 0.333333, 5, 5, 5, 14, 14, 14, 14, 14, 14]
        elif agreement_term == 24:
            body_share = [0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 3.00, 3.00, 3.00, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333, 7.3333333333333]
        elif agreement_term == 36:
            body_share = [0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 0.333333333, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] 
        tmp_total_price = total_price
        
        for i in range(agreement_term - 1):
            body = total_price * body_share[i] / 100
            lease_payment = part_of_payment + vehicle_redemption_price - body

            table_content.append(
                {
                    'number': i + 1,
                    'date': (agreement_date + relativedelta(months=i + 1)).strftime('%d-%m-%Y'),
                    'lease_payment': f'{lease_payment:.2f}',
                    'payment_on_account': f'{body:.2f}',
                    'total_price': f'{(vehicle_redemption_price + part_of_payment):.2f}',
                    'vehicle_redemption_price': '–' if i + 1 < amount_of_moratorium_days else f'{(tmp_total_price - body):.2f}',
                }
            )
            tmp_total_price -= body

        body = total_price * body_share[agreement_term - 1] / 100
        lease_payment = part_of_payment + vehicle_redemption_price - body
        table_content.append(
            {
                'number': agreement_term,
                'date': (agreement_date + relativedelta(months=agreement_term)).strftime('%d-%m-%Y'),
                'lease_payment': f'{lease_payment:.2f}',
                'payment_on_account': f'{body:.2f}',
                'total_price': f'{(vehicle_redemption_price + part_of_payment):.2f}',
                'vehicle_redemption_price': f'{0.00:.2f}'
            }
        )

        return table_content

    