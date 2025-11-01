import os
import calendar
from docxtpl import DocxTemplate
from datetime import timedelta
from num2words import num2words
from dateutil.relativedelta import relativedelta
from datetime import datetime

from .calculators import annuityCalculator
from .calculators import gradientCalculator
from .calculators import hybridCalculator
from .calculators import interestCalculator
from .calculators import standardCalculator


MONTH_NAMES = [
    'Января',
    'Февраля',
    'Марта', 
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября', 
    'Ноября',
    'Декабря'
]

def declension_of_the_month(number: int):
    last_number = number % 10

    if number % 100 > 10 and number % 100 < 20:
        return 'месяцев'
    if last_number == 1:
        return 'месяц'
    if last_number == 2 or last_number == 3 or last_number == 4:
        return 'месяца'
    
    return 'месяцев'


def NoneChecker(value):
    return '' if value is None else value


class DocxGenerator:
    def generate_application_for_transfer(self, leasing_agreement_model):
        document = DocxTemplate(os.path.join('documents', 'application_for_transfer_of_documents.docx'))
        
        client_model = leasing_agreement_model.client
        month_number = client_model.date_of_birth.month - 1
        month_name = MONTH_NAMES[month_number]

        price = leasing_agreement_model.transfer_amount_via_RS if leasing_agreement_model.payment_split_checkbox else leasing_agreement_model.price

        context = {
            'Clifio': f'{client_model.surname} {client_model.name} {client_model.patronymic}',
            'CliBirthDate': client_model.date_of_birth.strftime(f'%d {month_name} %Y'),
            'CliBirthPlace': client_model.place_of_birth,
            'CliPassport': f'{client_model.passport_series} {client_model.passport_number}',
            'CliIssuedBy': client_model.issued_by,
            'CliIssuedDate': client_model.date_of_issued.strftime('%d-%m-%Y'),
            'CliPassportCode': client_model.department_code,
            'CliInn': NoneChecker(client_model.taxpayer_identification_number),
            'CliPhoneNumber': NoneChecker(client_model.phone_number),
            'CliEmail': NoneChecker(client_model.email),
            'CliRegPlace': client_model.registration_address,

            'CliBankRec': NoneChecker(client_model.bank_of_recipient),
            'CliBankBik': NoneChecker(client_model.bik_bank),
            'CliBankInn': NoneChecker(client_model.inn_bank),
            'CliBankKpp': NoneChecker(client_model.kpp_bank),
            'CliBankKrr': NoneChecker(client_model.krr_bank),

            'RecipientAccount': NoneChecker(client_model.recipient_account),

            'AgreementNumber': f"ЛК0{leasing_agreement_model.id}-{leasing_agreement_model.agreement_date.strftime('%m%y')}",
            'AgreementStartDate': leasing_agreement_model.agreement_date.strftime('%d-%m-%Y'),
            'AgreementPrice': f"{price} ({num2words(number=price, lang='ru')}) рублей 00 копеек",
        
            'TheWordPartial': '(частичная) ' if leasing_agreement_model.payment_split_checkbox else '',
        }

        document.render(context)

        return document

    def generate_anketa2(self, model):
        document = DocxTemplate(os.path.join('documents', 'anketa2.docx'))

        month_number = model.date_of_birth.month - 1
        month_name = MONTH_NAMES[month_number]

        context = {
            'Clifio': f'{model.surname} {model.name} {model.patronymic}',
            'CliPassport': f'{model.passport_series} {model.passport_number}',
            'CliIssuedBy': model.issued_by,
            'CliIssuedDate' : model.date_of_issued.strftime('%d-%m-%Y'),
            'CliBirthDate': model.date_of_birth.strftime(f'%d {month_name} %Y'),
            'CliRegPlace': model.registration_address,
        }

        document.render(context)

        return document
    
    def leasing_closing(self, leasing_agreement_model,  leasing_closing_date, total_price):
        document = DocxTemplate(os.path.join('documents', 'leasing_closing.docx'))

        leasing_closing_date = datetime.strptime(leasing_closing_date, '%Y-%m-%d').date()

        client_model = leasing_agreement_model.client
        leasing_item_model = leasing_agreement_model.leasing_item

        month_number = client_model.date_of_birth.month - 1
        month_name = MONTH_NAMES[month_number]

        quantity_of_months = leasing_agreement_model.agreement_term
        agreement_start_date = leasing_agreement_model.agreement_date

        context = {
            'Clifio': f'{client_model.surname} {client_model.name} {client_model.patronymic}',
            'CliBirthDate': client_model.date_of_birth.strftime(f'%d {month_name} %Y'),
            'CliBirthPlace': client_model.place_of_birth,
            'CliPassport': f'{client_model.passport_series} {client_model.passport_number}',
            'CliIssuedBy': client_model.issued_by,
            'CliIssuedDate' : client_model.date_of_issued.strftime('%d-%m-%Y'),
            'CliPassportCode': client_model.department_code,
            'CliRegPlace': client_model.registration_address,
            'CliINN': NoneChecker(client_model.taxpayer_identification_number),
            'CliPhoneNumber': NoneChecker(client_model.phone_number),
            'CliEmail': NoneChecker(client_model.email),
            
            'AgreementNumber': F"ЛК0{leasing_agreement_model.id}-{agreement_start_date.strftime('%m%y')}",
            'AgreementStartDate': agreement_start_date.strftime('%d-%m-%Y'),
            'AgreementEndDate': leasing_closing_date.strftime('%d-%m-%Y'),
            'AgreementEndDatePlusOneDay': (leasing_closing_date + timedelta(days=1)).strftime('%d-%m-%Y'),
            'AgreementClosingPrice': f"{total_price} ({num2words(number=total_price, lang='ru')}) рублей 00 копеек", # ((ЦЕНА, УКАЗЫВАЕМАЯ ПРИ ЗАКРЫТИИ) (ЦЕНА ПРОПИСЬЮ))

            'ItemPassport': leasing_item_model.pts,
            'ItemIssuedBy': leasing_item_model.issued_passport_organization,
            'ItemIssuedDate': leasing_item_model.passport_issue_date.strftime('%d-%m-%Y'),
            'ItemModel': leasing_item_model.vehicle_model_ts,
            'ItemBirthDate': leasing_item_model.year_of_vehicle_manufacture_ts.strftime('%Y'),
            'ItemEngineModel': leasing_item_model.engine_model,
            'ItemBody': leasing_item_model.body,
            'ItemRegNumber': leasing_item_model.register_sign,
            'ItemColor': leasing_item_model.body_color,
            'ItemVin': leasing_item_model.vin,
            'ItemSts': leasing_item_model.registration_certificate,
        }

        document.render(context)

        return document

    def generate_dfa(self, leasing_agreement_model):
        document = DocxTemplate(os.path.join('documents', 'dfa.docx'))

        client_model = leasing_agreement_model.client
        leasing_item_model = leasing_agreement_model.leasing_item

        month_number1 = client_model.date_of_birth.month - 1
        month_name1 = MONTH_NAMES[month_number1]

        calculator = None

        bold_value = '' if not leasing_agreement_model.payment_split_checkbox else f'путём перечисления денежных средств на расчётный счёт продавца в размере {leasing_agreement_model.transfer_amount_via_RS} ({num2words(number=leasing_agreement_model.transfer_amount_via_RS, lang="ru")}) рублей 00 копеек и выдачи наличными денежными средствами из кассы покупателя в размере {leasing_agreement_model.cash_withdrawal_amount_DS} ({num2words(number=leasing_agreement_model.cash_withdrawal_amount_DS, lang="ru")}) рублей 00 коп.'

        payment_schedule = leasing_agreement_model.payment_schedule

        if payment_schedule == 'Аннуитет':
            calculator = annuityCalculator.AnnuityCalculator()
        elif payment_schedule == 'Гибрид':
            calculator = hybridCalculator.HybridCalculator()
        elif payment_schedule == 'Градиент':
            calculator = gradientCalculator.GradientCalculator()
        elif payment_schedule == 'Проценты':
            calculator = interestCalculator.InterestCalculator()
        else:
            calculator = standardCalculator.StandardCalculator()

        quantity_of_months = leasing_agreement_model.agreement_term
        agreement_start_date = leasing_agreement_model.agreement_date

        table_content = calculator.get_table_content(leasing_agreement_model)

        if client_model.surnameAdditionally:
            month_number2 = client_model.date_of_birthAdditionally.month - 1
            month_name2 = MONTH_NAMES[month_number2]
            additional_info1 = f"{client_model.surname} {client_model.name} {client_model.patronymic}, уполномоченный по доверенности от: {client_model.surnameAdditionally} {client_model.nameAdditionally} {client_model.patronymicAdditionally}, {client_model.date_of_birthAdditionally.strftime(f'%d {month_name2} %Y')} г., место рождения {client_model.place_of_birthAdditionally}, паспорт серии {client_model.passport_seriesAdditionally} № {client_model.passport_numberAdditionally}, выдан {client_model.issued_byAdditionally}, {client_model.date_of_issuedAdditionally.strftime(f'%d-%m-%Y')} г., код подразделения {client_model.department_codeAdditionally}, зарегистрированый (-ая) по адресу: {client_model.registration_addressAdditionally}, доверенность {client_model.number_formAdditionally}, от {client_model.date_of_issued_of_attorneyAdditionally.strftime(f'%d-%m-%Y')}, выдал нотариус {client_model.notary_full_nameAdditionally}, зарегистрирована в реестре за № {client_model.number_registryAdditionally}."
            additional_fio = f"{client_model.surnameAdditionally} {client_model.nameAdditionally} {client_model.patronymicAdditionally}"
            additional_info2 = f", дата рождения {client_model.date_of_birthAdditionally.strftime(f'%d {month_name2} %Y')} г., место рождения {client_model.place_of_birthAdditionally}, паспорт серии {client_model.passport_seriesAdditionally} № {client_model.passport_numberAdditionally}, выдан {client_model.issued_byAdditionally}, {client_model.date_of_issuedAdditionally.strftime(f'%d-%m-%Y')} г., код подразделения {client_model.department_codeAdditionally}, зарегистрированый (-ая) по адресу: {client_model.registration_addressAdditionally}, в лице представителя по доверенности: "
            additional_info3 = f" доверенность {client_model.number_formAdditionally}, от {client_model.date_of_issued_of_attorneyAdditionally.strftime(f'%d-%m-%Y')}, выдал нотариус {client_model.notary_full_nameAdditionally}, зарегистрирована в реестре за № {client_model.number_registryAdditionally}, "
            additional_info4 = f" по дов. {client_model.number_formAdditionally} от {client_model.date_of_issued_of_attorneyAdditionally.strftime(f'%d-%m-%Y')}"
            additional_info5 = f"ФИО: {client_model.surnameAdditionally} {client_model.nameAdditionally} {client_model.patronymicAdditionally}\nДата рождения {client_model.date_of_birthAdditionally.strftime(f'%d {month_name2} %Y')} г.\nМесто рождения {client_model.place_of_birthAdditionally}\nПаспорт серии {client_model.passport_seriesAdditionally} № {client_model.passport_numberAdditionally}\nВыдан {client_model.date_of_issuedAdditionally.strftime(f'%d-%m-%Y')}, {client_model.issued_byAdditionally}\nКод подразделения {client_model.department_codeAdditionally}\nЗарегистрирован (-а) по адресу: {client_model.registration_addressAdditionally}\nВ лице представителя по доверенности,\n"
            additional_info6 = f"Доверенность {client_model.number_formAdditionally}, от {client_model.date_of_issued_of_attorneyAdditionally.strftime(f'%d-%m-%Y')}\nВыдал нотариус {client_model.notary_full_nameAdditionally}\nЗарегистрирована в реестре за № {client_model.number_registryAdditionally}"
        else:
            additional_info1 = f"{client_model.surname} {client_model.name} {client_model.patronymic}."
            additional_fio = ''
            additional_info2 = ''
            additional_info3 = ''
            additional_info4 = ''
            additional_info5 = ''
            additional_info6 = ''


        context = {
            'SecondPoint': bold_value,

            'Clifio': f'{client_model.surname} {client_model.name} {client_model.patronymic}',
            'CliBirthDate': client_model.date_of_birth.strftime(f'%d {month_name1} %Y'),
            'CliBirthPlace': client_model.place_of_birth,
            'CliPassport': f'{client_model.passport_series} {client_model.passport_number}',
            'CliIssuedBy': client_model.issued_by,
            'CliPassportIssuedDate': client_model.date_of_issued.strftime('%d-%m-%Y'),
            'CliPassportCode': client_model.department_code,
            'CliRegPlace': client_model.registration_address,
            'CliINN': NoneChecker(client_model.taxpayer_identification_number),
            'CliPhoneNumber': NoneChecker(client_model.phone_number),
            'CliEmail': NoneChecker(client_model.email),

            'AgreementNumber': F"ЛК0{leasing_agreement_model.id}-{agreement_start_date.strftime('%m%y')}",
            'AgreementStartDate': agreement_start_date.strftime('%d-%m-%Y'),
            'AgreementEndDate': (agreement_start_date + relativedelta(months=quantity_of_months)).strftime('%d-%m-%Y'),
            'AgreementEndDatePlusOneDay': (agreement_start_date + relativedelta(months=quantity_of_months) + timedelta(days=1)).strftime('%d-%m-%Y'),
            'AgreementPrice': f"{leasing_agreement_model.price} ({num2words(number=leasing_agreement_model.price, lang='ru')}) рублей 00 копеек", # (СУММА (из «создать договор лизинга») 
            'AgreementTerm': f"{leasing_agreement_model.agreement_term} ({num2words(leasing_agreement_model.agreement_term, lang='ru')}) {declension_of_the_month(leasing_agreement_model.agreement_term)}", # (СРОК) 
            'AgreementMoratorium': f"{leasing_agreement_model.moratorium} ({num2words(number=leasing_agreement_model.moratorium, lang='ru')}) {declension_of_the_month(leasing_agreement_model.moratorium)}", # ((мораторий, МЕСЯЦЕВ) (прописью))

            'ItemPassport': leasing_item_model.pts,
            'ItemIssuedBy': leasing_item_model.issued_passport_organization,
            'ItemIssuedDate': leasing_item_model.passport_issue_date.strftime('%d-%m-%Y'),
            'ItemModel': leasing_item_model.vehicle_model_ts,
            'ItemBirthDate': leasing_item_model.year_of_vehicle_manufacture_ts.strftime('%Y'),
            'ItemEngineModel': leasing_item_model.engine_model,
            'ItemBody': leasing_item_model.body,
            'ItemRegNumber': leasing_item_model.register_sign,
            'ItemColor': leasing_item_model.body_color,
            'ItemVin': leasing_item_model.vin,
            'ItemSts': leasing_item_model.registration_certificate,
            'ItemChassis': leasing_item_model.chassis,
            'ItemMileage': leasing_item_model.mileage,

            'tbl_contents': table_content,
            'AdditionalInfo1': additional_info1,
            'AdditionalFIO': additional_fio,
            'AdditionalInfo2': additional_info2,
            'AdditionalInfo3': additional_info3,
            'AdditionalInfo4': additional_info4,
            'AdditionalInfoTab1': additional_info5,
            'AdditionalInfoTab2': additional_info6
        }
        
        document.render(context)

        return document
        
