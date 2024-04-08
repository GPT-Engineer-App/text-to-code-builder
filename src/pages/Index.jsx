import { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import { FaCode, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";

const API_URL = "https://backengine-9yyb.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 204) {
        toast({
          title: "Signup Successful",
          description: "You can now log in with your credentials.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Signup Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: "An error occurred during signup.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    toast({
      title: "Logged Out",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleGenerateCode = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedCode(data.choices[0].text.trim());
      } else {
        toast({
          title: "Code Generation Failed",
          description: "An error occurred while generating code.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Code generation error:", error);
      toast({
        title: "Code Generation Failed",
        description: "An error occurred while generating code.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" size="2xl" mb={8} textAlign="center">
        Text to Code Web Page and App Builder
      </Heading>

      {!isLoggedIn ? (
        <Stack spacing={4} maxW="md" mx="auto">
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Stack direction="row" spacing={4}>
            <Button leftIcon={<FaSignInAlt />} colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
            <Button leftIcon={<FaUser />} colorScheme="green" onClick={handleSignup}>
              Signup
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={4}>
          <Button leftIcon={<FaSignOutAlt />} colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
          <FormControl id="prompt">
            <FormLabel>Enter your prompt:</FormLabel>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </FormControl>
          <Button leftIcon={<FaCode />} colorScheme="blue" onClick={handleGenerateCode}>
            Generate Code
          </Button>
          {generatedCode && (
            <Box borderWidth={1} borderRadius="md" p={4}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Generated Code:
              </Text>
              <pre>{generatedCode}</pre>
            </Box>
          )}
        </Stack>
      )}
    </Container>
  );
};

export default Index;
