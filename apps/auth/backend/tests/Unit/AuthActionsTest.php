<?php

namespace Tests\Unit;

use App\Actions\AuthActions;
use App\External\UserRepository;
use App\Validators\UserValidator;
use App\Constants\SecurityConstants;
use App\Exceptions\UnauthorizedException;
use PHPUnit\Framework\TestCase;
use Mockery;

class AuthActionsTest extends TestCase
{
    private AuthActions $authActions;
    private UserRepository $userRepository;
    private UserValidator $validator;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->userRepository = Mockery::mock(UserRepository::class);
        $this->validator = Mockery::mock(UserValidator::class);
        $this->authActions = new AuthActions($this->userRepository, $this->validator);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_register_user_with_valid_data(): void
    {
        // Arrange
        $userData = [
            'email' => 'test@example.com',
            'username' => 'testuser',
            'password' => 'Password123!',
            'first_name' => 'Test',
            'last_name' => 'User'
        ];

        $sanitizedData = [
            'email' => 'test@example.com',
            'username' => 'testuser',
            'password' => 'Password123!',
            'first_name' => 'Test',
            'last_name' => 'User'
        ];

        $mockUser = (object) [
            'id' => 1,
            'email' => 'test@example.com',
            'username' => 'testuser',
            'first_name' => 'Test',
            'last_name' => 'User'
        ];

        $mockValidationResult = Mockery::mock();
        $mockValidationResult->shouldReceive('isValid')->andReturn(true);
        $mockValidationResult->shouldReceive('getSanitizedData')->andReturn($sanitizedData);

        $this->validator->shouldReceive('validateRegistration')
            ->with($userData)
            ->andReturn($mockValidationResult);

        $mockUser->shouldReceive('getRoleNames')->andReturn(['user']);

        $this->userRepository->shouldReceive('createUser')
            ->with($sanitizedData)
            ->andReturn($mockUser);

        // Act
        $result = $this->authActions->registerUser($userData);

        // Assert
        $this->assertIsArray($result);
        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertEquals('test@example.com', $result['user']['email']);
        $this->assertIsString($result['token']);
    }

    public function test_register_user_with_invalid_data(): void
    {
        // Arrange
        $userData = [
            'email' => 'invalid-email',
            'username' => '',
            'password' => '123',
            'first_name' => '',
            'last_name' => ''
        ];

        $mockValidationResult = Mockery::mock();
        $mockValidationResult->shouldReceive('isValid')->andReturn(false);
        $mockValidationResult->shouldReceive('getFirstError')->andReturn('Invalid email format');

        $this->validator->shouldReceive('validateRegistration')
            ->with($userData)
            ->andReturn($mockValidationResult);

        // Act & Assert
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid email format');
        
        $this->authActions->registerUser($userData);
    }

    public function test_login_user_with_valid_credentials(): void
    {
        // Arrange
        $credentials = [
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $sanitizedCredentials = [
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $mockUser = (object) [
            'id' => 1,
            'email' => 'test@example.com',
            'username' => 'testuser',
            'first_name' => 'Test',
            'last_name' => 'User',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'is_active' => true
        ];

        $mockValidationResult = Mockery::mock();
        $mockValidationResult->shouldReceive('isValid')->andReturn(true);
        $mockValidationResult->shouldReceive('getSanitizedData')->andReturn($sanitizedCredentials);

        $this->validator->shouldReceive('validateLogin')
            ->with($credentials)
            ->andReturn($mockValidationResult);

        $this->userRepository->shouldReceive('findByEmail')
            ->with('test@example.com')
            ->andReturn($mockUser);

        $this->userRepository->shouldReceive('updateLastLogin')
            ->with(1);

        $mockUser->shouldReceive('getRoleNames')->andReturn(['user']);

        // Act
        $result = $this->authActions->loginUser($credentials);

        // Assert
        $this->assertIsArray($result);
        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertEquals('test@example.com', $result['user']['email']);
    }

    public function test_login_user_with_invalid_credentials(): void
    {
        // Arrange
        $credentials = [
            'email' => 'test@example.com',
            'password' => 'wrongpassword'
        ];

        $sanitizedCredentials = [
            'email' => 'test@example.com',
            'password' => 'wrongpassword'
        ];

        $mockValidationResult = Mockery::mock();
        $mockValidationResult->shouldReceive('isValid')->andReturn(true);
        $mockValidationResult->shouldReceive('getSanitizedData')->andReturn($sanitizedCredentials);

        $this->validator->shouldReceive('validateLogin')
            ->with($credentials)
            ->andReturn($mockValidationResult);

        // Return null to simulate user not found
        $this->userRepository->shouldReceive('findByEmail')
            ->with('test@example.com')
            ->andReturn(null);

        // Act & Assert
        $this->expectException(UnauthorizedException::class);
        $this->expectExceptionMessage('Invalid credentials');
        
        $this->authActions->loginUser($credentials);
    }

    public function test_login_user_with_inactive_account(): void
    {
        // Arrange
        $credentials = [
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $sanitizedCredentials = [
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $mockUser = (object) [
            'id' => 1,
            'email' => 'test@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'is_active' => false // Inactive account
        ];

        $mockValidationResult = Mockery::mock();
        $mockValidationResult->shouldReceive('isValid')->andReturn(true);
        $mockValidationResult->shouldReceive('getSanitizedData')->andReturn($sanitizedCredentials);

        $this->validator->shouldReceive('validateLogin')
            ->with($credentials)
            ->andReturn($mockValidationResult);

        $this->userRepository->shouldReceive('findByEmail')
            ->with('test@example.com')
            ->andReturn($mockUser);

        // Act & Assert
        $this->expectException(UnauthorizedException::class);
        $this->expectExceptionMessage('Account is deactivated');
        
        $this->authActions->loginUser($credentials);
    }

    public function test_validate_token_with_valid_token(): void
    {
        // This test would require setting up JWT mocking
        // For now, we'll skip the implementation details
        $this->markTestIncomplete('JWT token validation test needs JWT mocking setup');
    }

    public function test_generate_jwt_token_structure(): void
    {
        // Test that JWT tokens contain required claims
        $this->markTestIncomplete('JWT generation test needs JWT verification setup');
    }
}
