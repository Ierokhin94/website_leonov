from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.db.models import Q
from utils import generateDocx
from . import serializers
from . import models


class GenerateAnketaDocxView(ListAPIView):
    queryset = models.ClientModel.objects.all()
    serializer_class = serializers.ClientSerializer
    def get(self, request):
        client_id = request.query_params.get('client_id')
        if client_id:
            try:
                client = models.ClientModel.objects.get(id=client_id, status=True)
                docx = generateDocx.DocxGenerator()
                output = docx.generate_anketa2(client)
                response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                response['Content-Disposition'] = 'attachment; filename=anketa.docx'
                output.save(response)

                return response

            except models.ClientModel.DoesNotExist:
                return Response(
                    {"detail": "Client not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(data={"detail": "no client id in query param"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateApplicationForTransfer(APIView):
    def get(self, request):
        agreement_id = request.query_params.get('agreement_id')
        agreement = models.LeasingAgreementModel.objects.filter(id=agreement_id, status=True) 
        
        if not agreement.exists():
            return Response({'detail': 'Agreement not found'}, status=status.HTTP_404_NOT_FOUND)

        agreement = agreement.first()

        docx_generator = generateDocx.DocxGenerator()

        application_for_transfer_output = docx_generator.generate_application_for_transfer(agreement)

        response_application_for_transfer = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        response_application_for_transfer['Content-Disposition'] = 'attachment; filename=transfer.docx'
        application_for_transfer_output.save(response_application_for_transfer)
        
        return response_application_for_transfer


class GenerateDfaDocxView(APIView):
    def get(self, request):
        agreement_id = request.query_params.get('agreement_id')
        agreement = models.LeasingAgreementModel.objects.filter(id=agreement_id, status=True) 
        
        if not agreement.exists():
            return Response({'detail': 'Agreement not found'}, status=status.HTTP_404_NOT_FOUND)

        agreement = agreement.first()

        docx_generator = generateDocx.DocxGenerator()

        dfa_output = docx_generator.generate_dfa(agreement)

        response_dfa = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        response_dfa['Content-Disposition'] = 'attachment; filename=dfa.docx'
        dfa_output.save(response_dfa)
        
        return response_dfa


class GenerateLeasingClosingDocxView(APIView):
    def get(self, request):
        agreement_id = request.query_params.get('agreement_id')
        leasing_closing_date = request.query_params.get('leasing_closing_date')
        total_price = request.query_params.get('total_price')

        agreement = models.LeasingAgreementModel.objects.filter(id=agreement_id, status=True) 

        if not agreement.exists():
            return Response({'detail': 'Agreement not found'}, status=status.HTTP_404_NOT_FOUND)

        agreement = agreement.first()

        docx = generateDocx.DocxGenerator()
        output = docx.leasing_closing(agreement, leasing_closing_date, total_price)

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        response['Content-Disposition'] = 'attachment; filename=leasing-closing.docx'
        output.save(response)

        return response


class LeasingAgreementView(ListAPIView):
    queryset = models.LeasingAgreementModel.objects.filter(status=True)
    serializer_class = serializers.LeasingAgreementSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        leasing_agreement_id = request.query_params.get('id')
        try:
            leasing_agreement = models.LeasingAgreementModel.objects.get(id=leasing_agreement_id, status=True)
        except models.LeasingAgreementModel.DoesNotExist:
            return Response(
                {"detail": "Leasing agreement not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(leasing_agreement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        leasing_agreement_id = request.query_params.get('id')
        if leasing_agreement_id:
            try:
                leasing_agreement = models.LeasingAgreementModel.objects.get(id=leasing_agreement_id, status=True)
                serializer = self.get_serializer(leasing_agreement)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except models.LeasingAgreementModel.DoesNotExist:
                return Response(
                    {"detail": "Leasing agreement not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        fio = request.query_params.get('fio')
        if fio:
            agreements = models.LeasingAgreementModel.objects.filter(client_fio__iregex=r"{}".format(fio), status=True)
            serializer = self.get_serializer(agreements, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        page = self.paginate_queryset(self.queryset)
        serializer = self.get_serializer(page, many=True)
        data = {
            'total_amount': self.queryset.count(),
            'result': serializer.data
        }
        return Response(data=data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        leasing_agreement_id = request.query_params.get('id')
        try:
            leasing_agreement = models.LeasingAgreementModel.objects.get(id=leasing_agreement_id, status=True)
        except models.LeasingAgreementModel.DoesNotExist:
            return Response(
                {"detail": "Leasing agreement not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        leasing_agreement.status = False
        leasing_agreement.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClientView(ListAPIView):
    queryset = models.ClientModel.objects.filter(status=True)
    serializer_class = serializers.ClientSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        client_id = request.query_params.get('id')
        try:
            client = models.ClientModel.objects.get(id=client_id, status=True)
        except models.ClientModel.DoesNotExist:
            return Response(
                {"detail": "Client not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(client, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        client_id = request.query_params.get('id')
        if client_id:
            try:
                client = models.ClientModel.objects.get(id=client_id)
                serializer = self.get_serializer(client)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except models.ClientModel.DoesNotExist:
                return Response(
                    {"detail": "Client not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        query = request.query_params.get('q')
        if query:
            surname = query
            clients = models.ClientModel.objects.filter(
                Q(surname__iregex=r"{}".format(surname)),
                status=True)   

            serializer = self.get_serializer(clients, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        page = self.paginate_queryset(self.queryset)
        serializer = self.get_serializer(page, many=True)
        data = {
            'total_amount': self.queryset.count(),
            'result': serializer.data
        }
        return Response(data=data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        client_id = request.query_params.get('id')
        try:
            client = models.ClientModel.objects.get(id=client_id, status=True)
            client.status = False
            client.save()
        except models.ClientModel.DoesNotExist:
            return Response(
                {"detail": "Client not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class LeasingItemView(ListAPIView):
    queryset = models.LeasingItemModel.objects.filter(status=True)
    serializer_class = serializers.LeasingItemSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        leasing_item_id = request.query_params.get('id')
        try:
            leasing_item = models.LeasingItemModel.objects.get(id=leasing_item_id, status=True)
        except models.LeasingItemModel.DoesNotExist:
            return Response(
                {"detail": "Leasing item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(leasing_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        leasing_item_id = request.query_params.get('id')
        if leasing_item_id:
            try:
                leasing_item = models.LeasingItemModel.objects.get(id=leasing_item_id, status=True)
                serializer = self.get_serializer(leasing_item)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except models.LeasingItemModel.DoesNotExist:
                return Response(
                    {"detail": "Leasing item not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        title = request.query_params.get('title')
        vin = request.query_params.get('vin')
        pts = request.query_params.get('pts')

        if any(param is not None for param in [title, vin, pts]):
            filters = Q()

            if title is not None:
                filters |= Q(title__iregex=r"{}".format(title))

            if vin is not None:
                filters |= Q(vin__iregex=r"{}".format(vin))

            if pts is not None:
                filters |= Q(pts__iregex=r"{}".format(pts))
            
            leasing_items = models.LeasingItemModel.objects.filter(filters & Q(status=True))
            serializer = self.get_serializer(leasing_items, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        page = self.paginate_queryset(self.queryset)
        serializer = self.get_serializer(page, many=True)
        data = {
            'total_amount': self.queryset.count(),
            'result': serializer.data
        }
        return Response(data=data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        leasing_item_id = request.query_params.get('id')
        try:
            leasing_item = models.LeasingItemModel.objects.get(id=leasing_item_id, status=True)
        except models.LeasingItemModel.DoesNotExist:
            return Response(
                {"detail": "Leasing item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        leasing_item.status = False
        leasing_item.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LoginStatusView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            return Response({'detail': 'Authorized'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ClosingLeasingView(ListAPIView):
    serializer_class = serializers.ClosingLeasingModel

    def put(self, request, *args, **kwargs):
        agreement_id = request.query_params.get('id')
        try:
            agreement = models.ClosingLeasingModel.objects.get(id=agreement_id)
        except models.ClosingLeasingModel.DoesNotExist:
            return Response(
                {"detail": "agreement not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(agreement, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        agreement_id = request.query_params.get('id')
        if agreement_id:
            agreement = models.ClosingLeasingModel.objects.get(id=agreement_id)
            serializer = self.get_serializer(agreement)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(
            {"detail": "ClosingLeasingModel not found"},
            status=status.HTTP_404_NOT_FOUND
        )
