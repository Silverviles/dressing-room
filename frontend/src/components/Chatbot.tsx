import { useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatHistory from "./Chatbot/ChatHistory";
import Loading from "./Chatbot/Loading";
import html2pdf from "html2pdf.js";


export default function Chatbot(){

    const [userInput, setUserInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef(); // Create a ref for chat history
    const [showChat, setShowChat] = useState(false);

    // inislize your Gemeni Api
    const genAI = new GoogleGenerativeAI(
        "AIzaSyDi46vtkp0gNIcK8-BebNOXK5_n36secV0"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Function to handle user input
    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    // Function to send user message to Gemini
    const sendMessage = async () => {
        if (userInput.trim() === "") return;

        setShowChat(true);
        setIsLoading(true);
        try {

            const fashionExpertPrompt = `You are a fashion expert. Please assist the user with fashion-related advice. User says: "${userInput}"`;
            // call Gemini Api to get a response
            const result = await model.generateContent(fashionExpertPrompt);
            const response = await result.response;
            console.log(response);
            // add Gemeni's response to the chat history
            setChatHistory([
                ...chatHistory,
                { type: "user", message: userInput },
                { type: "bot", message: response.text() },
            ]);
        } catch {
            console.error("Error sending message");
        } finally {
            setUserInput("");
            setIsLoading(false);
        }
    };

    // Function to clear the chat history
    const clearChat = () => {
        setChatHistory([]);
        setShowChat(false);
    };
    
    const downloadChatAsPDF = () => {
        const element = chatRef.current; // Reference to the chat history element
        console.log(element); // Check if the element is not null
    
        // Create a new element for the PDF with the title
        const pdfContent = document.createElement('div');
        pdfContent.innerHTML = `
            <h1 style="text-align: center; margin-bottom: 20px;">Chat History</h1>
            <div>${element.innerHTML}</div>
        `;
    
        const opt = {
            margin: 1,
            filename: 'chat-history.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        if (pdfContent) {
            html2pdf().from(pdfContent).set(opt).save();
        } else {
            console.error('Chat history element not found');
        }
    };
    

    return(
        <div className="container mx-auto px-4 py-8 max-w-120">
            {showChat && ( // Conditional rendering of the chat container
                <div className="chat-container rounded-lg shadow-md p-4 overflow-y-scroll" ref={chatRef}>
                    <ChatHistory chatHistory={chatHistory} />
                    <Loading isLoading={isLoading} />
                </div>
            )}

            <div className="flex mt-4">
                <input
                type="text"
                className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={userInput}
                onChange={handleUserInput}
                />
                <button
                className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                onClick={sendMessage}
                disabled={isLoading}
                >
                Send
                </button>
            </div>
            <div className="flex mt-4 space-x-2">
                <button
                    className="block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
                    onClick={clearChat}
                >
                    Clear Chat
                </button>
                {chatHistory.length > 0 && ( // Conditional rendering for the download button
                    <button
                        className="block px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none"
                        onClick={downloadChatAsPDF}
                    >
                        Download Chat as PDF
                    </button>
                )}
            </div>
        </div>
    );
}