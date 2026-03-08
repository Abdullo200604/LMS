from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .serializers import LoginSerializer, RegisterSerializer, UserProfileSerializer, AssignmentSerializer, \
    BookSerializer, CalendarEventSerializer
from .models import User, Assignment, Book, CalendarEvent
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated


class RegisterAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="User Registration",
        description="Register a new user",
        request=RegisterSerializer,
        responses={
            201: OpenApiResponse(response=RegisterSerializer, description="JWT access token and refresh token"),
            400: OpenApiResponse(description="Invalid input data")
        },
        tags=["User Authentication API"]
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": access_token
                }, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="User Login",
        description="Login user with username and password",
        request=LoginSerializer,
        responses={
            200: OpenApiResponse(response=LoginSerializer, description="JWT access token and refresh token"),
            400: OpenApiResponse(description="Invalid credentials")
        },
        tags=["User Authentication API"]
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['username']
            password = serializer.validated_data['password']

            try:
                user_obj = User.objects.get(username=user)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            if user_obj and check_password(password, user_obj.password):
                refresh = RefreshToken.for_user(user_obj)
                access_token = str(refresh.access_token)

                return Response(
                    {
                        "refresh": str(refresh),
                        "access": access_token
                    }, status=status.HTTP_200_OK
                )
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Get User Profile Details",
        description="Get user profile API",
        responses={
            200: OpenApiResponse(description="User Profile Details"),
            400: OpenApiResponse(description="Invalid credentials")
        },
        tags=["User Profile API"]
    )
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class ProfileUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, JSONParser, FormParser)

    @extend_schema(
        summary="User Profile Update",
        description="User Profile Update with necessary fields",
        request=UserProfileSerializer,
        responses={
            200: OpenApiResponse(response=UserProfileSerializer,
                                 description="User profile details has been updated successfully"),
            400: OpenApiResponse(description="Invalid credentials")
        },
        tags=["User Profile API"]
    )
    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileUpdateFieldAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="User Profile Update with one field",
        description="User Profile Update with only necessary fields",
        request=UserProfileSerializer,
        responses={
            200: OpenApiResponse(response=UserProfileSerializer,
                                 description="User profile details has been updated successfully"),
            400: OpenApiResponse(description="Invalid credentials")
        },
        tags=["User Profile API"]
    )
    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssignmentListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Topshiriqlar ro'yxati",
        description="Barcha topshiriqlar ro'yxatini olish",
        responses={200: AssignmentSerializer(many=True)},
        tags=["Assignments"]
    )
    def get(self, request):
        assignments = Assignment.objects.all()
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)


class AssignmentCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Topshiriq yaratish",
        description="Yangi topshiriq yaratish (faqat ustoz)",
        request=AssignmentSerializer,
        responses={201: AssignmentSerializer},
        tags=["Assignments"]
    )
    def post(self, request):
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(teacher=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssignmentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Topshiriq ma'lumotlari",
        description="Bitta topshiriq tafsilotlari",
        responses={200: AssignmentSerializer},
        tags=["Assignments"]
    )
    def get(self, request, pk):
        assignment = get_object_or_404(Assignment, pk=pk)
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data)


class AssignmentUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Topshiriqni tahrirlash",
        description="Topshiriqni tahrirlash (faqat ustoz)",
        request=AssignmentSerializer,
        responses={200: AssignmentSerializer},
        tags=["Assignments"]
    )
    def put(self, request, pk):
        assignment = get_object_or_404(Assignment, pk=pk)
        if assignment.teacher != request.user:
            return Response({'error': 'Faqat o‘qituvchi o‘zgartira oladi!'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AssignmentSerializer(assignment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssignmentDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Topshiriqni o'chirish",
        description="Topshiriqni o'chirish (faqat ustoz)",
        responses={204: OpenApiResponse(description="Deleted")},
        tags=["Assignments"]
    )
    def delete(self, request, pk):
        assignment = get_object_or_404(Assignment, pk=pk)
        if assignment.teacher != request.user:
            return Response({'error': 'Faqat o‘qituvchi o‘chirishi mumkin!'}, status=status.HTTP_403_FORBIDDEN)
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from rest_framework.parsers import MultiPartParser, FormParser
from .models import Submission
from .serializers import SubmissionSerializer


class AssignmentSubmissionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        summary="Topshiriqni topshirish",
        description="Student topshiriq javobini fayl ko‘rinishida yuklaydi (3 martagacha)",
        request=SubmissionSerializer,
        responses={201: SubmissionSerializer},
        tags=["Assignments"]
    )
    def post(self, request, assignment_id):
        assignment = get_object_or_404(Assignment, pk=assignment_id)
        prev_attempts = Submission.objects.filter(assignment=assignment, student=request.user).count()
        if prev_attempts >= 3:
            return Response({'error': "Siz 3 martadan ortiq yubora olmaysiz."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(student=request.user, assignment=assignment, attempt=prev_attempts + 1)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AssignmentGradeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Topshiriqqa baho qo'yish",
        description="Ustoz topshiriqni baholaydi va sharh yozadi",
        request=SubmissionSerializer,
        responses={200: SubmissionSerializer},
        tags=["Assignments"]
    )
    def post(self, request, submission_id):
        submission = get_object_or_404(Submission, pk=submission_id)
        assignment = submission.assignment
        if assignment.teacher != request.user:
            return Response({'error': 'Faqat o‘qituvchi baho qo‘yishi mumkin!'}, status=status.HTTP_403_FORBIDDEN)
        grade = request.data.get('grade')
        feedback = request.data.get('feedback', '')
        submission.grade = grade
        submission.feedback = feedback
        submission.save()
        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BookListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Darsliklar ro'yxati",
        description="Barcha darsliklarni ko‘rish",
        responses={200: BookSerializer(many=True)},
        tags=["Books"]
    )
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)


class BookCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        summary="Darslik yuklash",
        description="Yangi darslik fayli yuklash (faqat ustoz yoki admin)",
        request=BookSerializer,
        responses={201: BookSerializer},
        tags=["Books"]
    )
    def post(self, request):
        if not request.user.role in ('ustoz', 'admin'):
            return Response({'error': "Faqat ustoz yoki admin fayl yuklashi mumkin!"}, status=status.HTTP_403_FORBIDDEN)
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Bitta darslik tafsiloti",
        description="Muayyan darslik haqida to'liq ma'lumot",
        responses={200: BookSerializer},
        tags=["Books"]
    )
    def get(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book)
        return Response(serializer.data)


class BookDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Darslikni o‘chirish",
        description="Darslikni o‘chirish (faqat yuklovchi ustoz yoki admin)",
        tags=["Books"]
    )
    def delete(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        if not (book.uploaded_by == request.user or request.user.role == 'admin'):
            return Response({'error': 'Faqat o‘z darsligini yoki admin o‘chira oladi!'}, status=403)
        book.delete()
        return Response(status=204)


class MyGradesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Mening baholarim",
        description="Foydalanuvchi o‘ziga tegishli barcha topshiriqlarning baholarini ko‘radi",
        responses={200: SubmissionSerializer(many=True)},
        tags=["Grades"]
    )
    def get(self, request):
        submissions = Submission.objects.filter(student=request.user).exclude(grade=None)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class TeacherGradesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Ustoz uchun barcha baholar",
        description="Ustoz o‘zi yaratgan topshiriqlarga barcha studentlar tomonidan yuborilgan baholarni ko‘radi",
        responses={200: SubmissionSerializer(many=True)},
        tags=["Grades"]
    )
    def get(self, request):
        if not request.user.role == 'ustoz':
            return Response({'error': "Faqat ustozlar uchun!"}, status=403)
        submissions = Submission.objects.filter(assignment__teacher=request.user)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class GradeSetAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Submission uchun baho va izoh qo‘yish",
        description="Ustoz yoki admin student submissioniga baho va feedback qo‘yadi",
        request=SubmissionSerializer,
        responses={200: SubmissionSerializer},
        tags=["Grades"]
    )
    def post(self, request, submission_id):
        submission = get_object_or_404(Submission, pk=submission_id)
        assignment = submission.assignment
        if not (assignment.teacher == request.user or request.user.role == 'admin'):
            return Response({'error': "Faqat o‘qituvchi yoki admin baho qo‘yishi mumkin!"}, status=403)
        grade = request.data.get('grade')
        feedback = request.data.get('feedback', '')
        if grade is None:
            return Response({'error': 'Grade maydoni majburiy!'}, status=400)
        submission.grade = grade
        submission.feedback = feedback
        submission.save()
        serializer = SubmissionSerializer(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AllGradesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Barcha baholar (admin)",
        description="Admin yoki zamdirektor barcha submissionlarni va baholarni ko‘radi",
        responses={200: SubmissionSerializer(many=True)},
        tags=["Grades"]
    )
    def get(self, request):
        if not request.user.role in ['admin', 'zamdirektor']:
            return Response({'error': "Faqat admin yoki zamdirektor uchun!"}, status=403)
        submissions = Submission.objects.exclude(grade=None)
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class CalendarEventListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Kalendar tadbirlar ro'yxati",
        description="Barcha dars va deadline tadbirlarini ko‘rish",
        responses={200: CalendarEventSerializer(many=True)},
        tags=["Calendar"]
    )
    def get(self, request):
        events = CalendarEvent.objects.filter(for_group__in=[request.user.role, "All", "", None])
        serializer = CalendarEventSerializer(events, many=True)
        return Response(serializer.data)


class CalendarEventCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Yangi tadbir yoki dars qo'shish",
        description="Ustoz yoki admin yangi kalendar tadbiri yoki dars kiritadi",
        request=CalendarEventSerializer,
        responses={201: CalendarEventSerializer},
        tags=["Calendar"]
    )
    def post(self, request):
        if not request.user.role in ['ustoz', 'admin']:
            return Response({'error': "Faqat ustoz yoki admin tadbir qo‘shishi mumkin!"}, status=403)
        serializer = CalendarEventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CalendarEventDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Bitta kalendar tadbir tafsiloti",
        description="Muayyan dars yoki deadline haqida to'liq ma'lumot",
        responses={200: CalendarEventSerializer},
        tags=["Calendar"]
    )

    def get(self, request, pk):
        event = get_object_or_404(CalendarEvent, pk=pk)
        serializer = CalendarEventSerializer(event)
        return Response(serializer.data)



class CalendarEventDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @extend_schema(
        summary="Tadbirni o‘chirish",
        description="Faqat o‘z tadbirini yoki admin tadbirni o‘chiradi",
        tags=["Calendar"]
    )

    def delete(self, request, pk):
        event = get_object_or_404(CalendarEvent, pk=pk)
        if not (event.created_by == request.user or request.user.role == 'admin'):
            return Response({'error': 'Faqat o‘z tadbirini yoki admin o‘chirishi mumkin!'}, status=403)
        event.delete()
        return Response(status=204)

