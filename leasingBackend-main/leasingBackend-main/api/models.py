from django.db import models
from django.core.validators import RegexValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator


class ClientModel(models.Model):
    max_length = 1000

    GENDER_CHOICES = [
        ('М', 'Мужчина'),
        ('Ж', 'Женщина'),
    ]

    created_at = models.DateTimeField(auto_now=True, editable=False)
    surname = models.CharField(max_length=max_length, verbose_name='Фамилия')
    name = models.CharField(max_length=max_length, verbose_name='Имя')
    patronymic = models.CharField(max_length=max_length, verbose_name='Отчество')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name='Пол')
    date_of_birth = models.DateField(verbose_name='Дата рождения')
    passport_series = models.CharField(
        validators=[
            RegexValidator(
                regex=r'^\d{4}$',
                message="Field must consist of exactly four digits.",
                code='invalid_series'
            )
        ],
        max_length=4,
        verbose_name='Серия'
    )
    passport_number = models.CharField(
        validators=[
            RegexValidator(
                regex=r'^\d{6}$',
                message="Field must consist of exactly six digits.",
                code='invalid_number'
            )
        ],
        max_length=6,
        verbose_name='Номер'
    )
    department_code = models.CharField(
        validators=[
            RegexValidator(
                regex=r'^\d{3}-\d{3}$',
                message="Field must consist of exactly six digits.",
                code='invalid_number'
            )
        ],
        max_length=7,
        verbose_name='Код подразделения'
    )
    issued_by = models.TextField(verbose_name='Кем выдан')
    date_of_issued = models.DateField(verbose_name='Дата выдачи')
    registration_address = models.TextField(verbose_name='Адрес регистрации')
    address = models.TextField(verbose_name='Фактический адрес')
    
    place_of_birth = models.TextField(max_length=max_length, verbose_name='Место рождения')
    taxpayer_identification_number = models.PositiveIntegerField(null=True, blank=True, verbose_name='ИНН')
    phone_number = models.CharField(null=True, blank=True, max_length=max_length, verbose_name='Номер телефона')
    email = models.CharField(null=True, blank=True, max_length=max_length, verbose_name='Почта')

    bank_of_recipient = models.CharField(null=True, blank=True, max_length=max_length, verbose_name='Банк получатель')
    bik_bank = models.CharField(max_length=max_length, null=True, blank=True, verbose_name='БИК Банк')
    inn_bank = models.CharField(max_length=max_length, null=True, blank=True, verbose_name='ИНН Банк')
    kpp_bank = models.CharField(max_length=max_length, null=True, blank=True, verbose_name='КПП Банк')
    krr_bank = models.CharField(max_length=max_length, null=True, blank=True, verbose_name='Корр. Счет')
    recipient_account = models.CharField(max_length=max_length, null=True, blank=True, verbose_name='Счет Получателя')
    
    status = models.BooleanField(default=True, blank=True)    

    surnameAdditionally = models.CharField(max_length=max_length, null=True, blank=True,
                                         default="", verbose_name='Фамилия доверителя')
    nameAdditionally = models.CharField(max_length=max_length, null=True, blank=True,
                                      default="", verbose_name='Имя доверителя')
    patronymicAdditionally = models.CharField(max_length=max_length, null=True, blank=True,
                                            default="", verbose_name='Отчество доверителя')
    date_of_birthAdditionally = models.DateField(null=True, blank=True, default=None, verbose_name="Дата рождения доверителя")
    place_of_birthAdditionally = models.TextField(null=True, blank=True, default="", verbose_name="Место рождения доверителя")
    genderAdditionally = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True,
                                        default=None, verbose_name='Пол доверителя')
    passport_seriesAdditionally = models.CharField(
        null=True,
        blank=True,
        default="",
        validators=[
            RegexValidator(
                regex=r'^\d{4}$',
                message="Field must consist of exactly four digits.",
                code='invalid_series'
            )
        ],
        max_length=4,
        verbose_name="Серия паспорта доверителя"
    )
    passport_numberAdditionally = models.CharField(
        null=True,
        blank=True,
        default="",
        validators=[
         RegexValidator(
             regex=r'^\d{6}$',
             message="Field must consist of exactly six digits.",
             code='invalid_number'
         )
        ],
        max_length=6,
        verbose_name="Номер паспорта доверителя"
    )
    issued_byAdditionally = models.TextField(null=True, blank=True, default="", verbose_name='Кем выдан доверителя')
    date_of_issuedAdditionally = models.DateField(null=True, blank=True, default=None, verbose_name='Дата выдачи доверителя')
    department_codeAdditionally = models.CharField(
        null=True,
        blank=True,
        default="",
        validators=[
            RegexValidator(
                regex=r'^\d{3}-\d{3}$',
                message="Field must consist of exactly six digits.",
                code='invalid_number'
            )
        ],
        max_length=7,
        verbose_name='Код подразделения доверителя'
    )
    registration_addressAdditionally = models.TextField(null=True, blank=True, default="", verbose_name='Фактический адрес доверителя')
    number_formAdditionally = models.CharField(null=True, blank=True, max_length=50, default="", verbose_name='Номер доверенности')
    date_of_issued_of_attorneyAdditionally = models.DateField(null=True, blank=True, default=None, verbose_name="Дата доверенности")
    notary_full_nameAdditionally = models.CharField(null=True, blank=True, max_length=max_length, default="", verbose_name="Фио нотариуса")
    number_registryAdditionally = models.CharField(null=True, blank=True, max_length=max_length, default="", verbose_name="Номер в реестре")

    def __str__(self):
        return f"client {self.surname}"

    class Meta:
        ordering = ['-id']


class LeasingItemModel(models.Model):
    max_length = 1000
    
    created_at = models.DateTimeField(auto_now=True, editable=False)
    title = models.TextField(verbose_name='Навзвание')
    pts = models.CharField(max_length=max_length, verbose_name='Паспорт транспортного средства (ПТС)')
    vin = models.CharField(max_length=max_length, verbose_name='Идентификационный номер (VIN)')
    vehicle_model_ts = models.TextField(verbose_name='Марка, модель ТС')
    year_of_vehicle_manufacture_ts = models.DateField(verbose_name='Год изготовления ТС')
    engine_model = models.CharField(max_length=max_length, verbose_name='Модель, № двигателя')
    chassis = models.CharField(verbose_name='Шасси (рама) №', max_length=max_length)
    body = models.CharField(max_length=max_length, verbose_name='Кузов (кабина, прицеп) №')
    body_color = models.TextField(verbose_name='Цвет кузова (кабины, прицепа)')
    issued_passport_organization = models.TextField(verbose_name='Наименование организации, выдавшей паспорт')
    passport_issue_date = models.DateField(verbose_name='Дата выдачи паспорта')
    registration_certificate = models.TextField(verbose_name='Свидетельство о регистрации ТС (СТС)')
    register_sign = models.CharField(max_length=max_length, verbose_name='Регистрационный знак')
    mileage = models.PositiveIntegerField(verbose_name='Пробег')
    price = models.PositiveIntegerField(verbose_name='Цена автомобиля', null=True, blank=True)
    status = models.BooleanField(default=True, blank=True)

    def __str__(self):
        return f'leasing item {self.title}'

    class Meta:
        ordering = ['-id']


class LeasingAgreementModel(models.Model):
    max_length = 1000

    CONTACT_TERM = [
        (12, '12 мес'),
        (24, '24 мес'),
        (36, '36 мес'),
    ]

    PAYMENT_SCHEDULE = [
        ('Гибрид', 'Гибрид'),
        ('Аннуитет', 'Аннуитет'),
        ('Градиент', 'Градиент'),
        ('Проценты', 'Проценты'),
        ('Стандарт', 'Стандарт'),
    ]    

    created_at = models.DateTimeField(auto_now=True, editable=False)
    agreement_date = models.DateField(verbose_name='Дата договора')
    client = models.ForeignKey(ClientModel, verbose_name='Клиент', on_delete=models.CASCADE, related_name='contracts')
    client_fio = models.CharField(verbose_name='Фио Клиента', blank=True, max_length=max_length)
    leasing_item = models.ForeignKey(LeasingItemModel, verbose_name='Предмет лизинга', on_delete=models.CASCADE, related_name='items')
    price = models.PositiveIntegerField(verbose_name='Сумма договора')
    agreement_term = models.PositiveIntegerField(verbose_name='Срок договора', choices=CONTACT_TERM)
    payment_schedule = models.CharField(verbose_name='График платежей', choices=PAYMENT_SCHEDULE, max_length=max_length)
    interest_rate = models.FloatField(verbose_name='Процентная ставка')
    moratorium = models.PositiveIntegerField(verbose_name='Мораторий', validators=[MinValueValidator(0)])
    payment_split_checkbox = models.BooleanField(null=True, blank=True, verbose_name='Галочка разделения платежа')
    transfer_amount_via_RS = models.PositiveIntegerField(null=True, blank=True, verbose_name='Сумма перевода через РС')
    cash_withdrawal_amount_DS = models.PositiveIntegerField(null=True, blank=True, verbose_name='Сумма выдачи наличными ДС')
    status = models.BooleanField(default=True, blank=True)
    payment = models.FloatField(null=True, blank=True, verbose_name='Платеж')

    def update_fio(self):
        self.client_fio = f"{self.client.surname} {self.client.name} {self.client.patronymic}"
        self.save()

    def save(self, *args, **kwargs):
        if not self.client_fio and self.client:
            self.client_fio = f"{self.client.surname} {self.client.name} {self.client.patronymic}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f'leasing agreement {self.id}'

    class Meta:
        ordering = ['-id']

@receiver(post_save, sender=ClientModel)
def update_contract_fio(sender, instance, **kwargs):
    for contract in instance.contracts.all():
        contract.update_fio()

class ClosingLeasingModel(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    date_of_closing = models.DateField(verbose_name='Дата закрытия договора', blank=True, null=True)
    total_closing_price = models.PositiveIntegerField(verbose_name='Сумма закрытия договора', blank=True, null=True)
    
    def __str__(self):
        return f'{id}'
    
@receiver(post_save, sender=LeasingAgreementModel)
def create_closing_leasing_agreement(sender, instance, created, **kwargs):
    if created:
        ClosingLeasingModel.objects.create(id=instance.id)