// collated transcript data for specific customer sessions in a specific time frame

const SAMPLE_TRANSCRIPTS = `
{
    "status": "success",
    "message": "Transcripts fetched successfully for ucid: b4a95870-5acb-4e23-a535-49b608e4edd0",
    "data": {
        "id": "5320e3d9-e2bd-45e2-bafe-2820f6ab03a0",
        "ucid": "b4a95870-5acb-4e23-a535-49b608e4edd0",
        "contactId": "",
        "lastEvaluatedKey": "TIME#2025-10-15T12:43:25.553Z#ts#1760532205802480",
        "transcripts": [
            {
                "messageId": "e82b8ff4-b350-4edd-9a3e-ef0a0d284437",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Participant Shyam Sharma has started a conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:14:27.937Z",
                "attachments": {}
            },
            {
                "messageId": "b85efbf3-17c4-4530-9a64-3263b8fcd4b6",
                "participantId": null,
                "participantName": null,
                "participantRole": null,
                "content": "Conversation rehydrated/resumed",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:14:38.211Z",
                "attachments": {}
            },
            {
                "messageId": "012e5da9-b30e-4c0c-ae01-85ec97555de8",
                "participantId": "edd49c66-0204-47c0-a103-9e19abd329eb",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "GoDaddy does not accept or ask for payment data over chat.  Do not include any payment card information or payment details in this chat.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:14:47.702Z",
                "attachments": {}
            },
            {
                "messageId": "aaddaf74-b064-451d-9925-41f526865c5d",
                "participantId": "14309899-c476-4214-abe0-b217d3a892e1",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "Hi, this is our virtual assistant! 👋 Tell us how we can help.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:14:50.911Z",
                "attachments": {}
            },
            {
                "messageId": "0098658c-c886-41fc-b7a7-cc715625b1be",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Please connect me to a guide",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:15:08.365Z",
                "attachments": {}
            },
            {
                "messageId": "7c79d66c-4ae4-4094-ab9e-3d976572e105",
                "participantId": "14309899-c476-4214-abe0-b217d3a892e1",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "I'm transferring you to a guide now. They'll be able to assist you further.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:15:17.034Z",
                "attachments": {}
            },
            {
                "messageId": "a3aac1a8-7d57-4ddd-935e-65ea8ea963b2",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Sure",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:15:26.737Z",
                "attachments": {}
            },
            {
                "messageId": "f525da5e-d1fb-4da6-a4a3-7126bf649c4e",
                "participantId": "edd49c66-0204-47c0-a103-9e19abd329eb",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "Transferring to a guide…",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:15:27.989Z",
                "attachments": {}
            },
            {
                "messageId": "f8b0be9d-f8e9-459b-b519-965c3917c15f",
                "participantId": "edd49c66-0204-47c0-a103-9e19abd329eb",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "Your estimated wait time is less than a minute.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:15:29.210Z",
                "attachments": {}
            },
            {
                "messageId": "5f0d7559-51c0-468e-a9d0-2d4dc5232bfb",
                "participantId": "756f9c20-9ace-41b3-a74f-5f878d24f09d",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Participant Shyam joined with role AGENT",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:15:35.271Z",
                "attachments": {}
            },
            {
                "messageId": "c513d639-e28b-43ff-a85d-19f5be65c000",
                "participantId": "756f9c20-9ace-41b3-a74f-5f878d24f09d",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Hi",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:15:51.502Z",
                "attachments": {}
            },
            {
                "messageId": "a035a7db-4b92-451d-9eed-d7c69451f77a",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Hello",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:15:55.035Z",
                "attachments": {}
            },
            {
                "messageId": "49f38bb8-bb37-40e7-a9de-852c9592af8c",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "I am struggling with my domain renewal ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:16:07.446Z",
                "attachments": {}
            },
            {
                "messageId": "506452e8-fa97-4829-a066-5e97cdffb68b",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "ak.com",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:16:10.508Z",
                "attachments": {}
            },
            {
                "messageId": "ef207f3c-d199-47ff-ad63-b89295b1a98c",
                "participantId": "756f9c20-9ace-41b3-a74f-5f878d24f09d",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Okay, what error you are getting ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:16:24.895Z",
                "attachments": {}
            },
            {
                "messageId": "9df5d190-2ee1-472c-847b-2beb424d3de7",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "it says domain already taken someone else ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:16:47.522Z",
                "attachments": {}
            },
            {
                "messageId": "7c168d18-090a-4cde-af91-cd2811cd2d70",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "how this can happen i am using this domain since 5 years now someone else has taken the domin",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:17:08.515Z",
                "attachments": {}
            },
            {
                "messageId": "000ced06-7b32-4bca-bbcd-7cb990ffa5e7",
                "participantId": "756f9c20-9ace-41b3-a74f-5f878d24f09d",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "I am sorry to hear that sir",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:17:21.332Z",
                "attachments": {}
            },
            {
                "messageId": "a076f666-9daa-4ba5-9b24-1121a6aaef83",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Participant Shyam Sharma with role CUSTOMER went idle",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:22:08.979Z",
                "attachments": {}
            },
            {
                "messageId": "54c36f74-8ad5-417c-88f4-1d46b3730b90",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Participant Shyam Sharma with role CUSTOMER got disconnected",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:27:09.076Z",
                "attachments": {}
            },
            {
                "messageId": "2bcdabb4-e5be-4ced-a9d2-294331173c34",
                "participantId": "756f9c20-9ace-41b3-a74f-5f878d24f09d",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Participant Shyam left the conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:27:09.129Z",
                "attachments": {}
            },
            {
                "messageId": "fb97c2fb-7c50-4527-9f32-d84cab6bf7bd",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Hi",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:38:17.095Z",
                "attachments": {}
            },
            {
                "messageId": "aa39b624-4dae-4b57-bf4c-b83ab30d82d6",
                "participantId": "edd49c66-0204-47c0-a103-9e19abd329eb",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "One moment, connecting you to a guide...",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:38:19.772Z",
                "attachments": {}
            },
            {
                "messageId": "30e80622-2183-4788-9c74-08edbfd44230",
                "participantId": "edd49c66-0204-47c0-a103-9e19abd329eb",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "*** IDLE RECONNECT *** Customer is returning from idle. Please review conversation.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:38:44.002Z",
                "attachments": {}
            },
            {
                "messageId": "70b6ac5a-ad94-4e28-a1cf-8e41c70d1964",
                "participantId": "4a9b649b-8aaf-4ed1-b3cb-81bf9a6b2f4c",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Participant Shyam joined with role AGENT",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:38:46.952Z",
                "attachments": {}
            },
            {
                "messageId": "874e29bb-ad02-4d22-8310-d8080f191b73",
                "participantId": "4a9b649b-8aaf-4ed1-b3cb-81bf9a6b2f4c",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Hi",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:39:00.516Z",
                "attachments": {}
            },
            {
                "messageId": "8537d70b-81f6-4e5f-b091-f8a0f5be7db0",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Please review my chat logs",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:39:10.727Z",
                "attachments": {}
            },
            {
                "messageId": "2749491f-d4f0-450d-8ac7-7fbf0b52b592",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "and tell me the issue",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:39:17.588Z",
                "attachments": {}
            },
            {
                "messageId": "b68e7158-53db-4f8d-b7ad-19b110ae6d29",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Okay",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:41:09.925Z",
                "attachments": {}
            },
            {
                "messageId": "6f7e6f7a-53f5-48f2-8a59-064152640af0",
                "participantId": "5c579bbe-270d-4574-a19f-6224ddd6950b",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "let me end this chat now ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:41:14.370Z",
                "attachments": {}
            },
            {
                "messageId": "2100c88e-c545-4bac-8bbd-61c043968368",
                "participantId": "4a9b649b-8aaf-4ed1-b3cb-81bf9a6b2f4c",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Hi",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:41:35.476Z",
                "attachments": {}
            },
            {
                "messageId": "a5ffb7d3-397b-4ebf-b30a-5071b893b351",
                "participantId": "4a9b649b-8aaf-4ed1-b3cb-81bf9a6b2f4c",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Participant Shyam left the conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:43:21.464Z",
                "attachments": {}
            },
            {
                "messageId": "0c204faa-08ce-4d06-bb5d-95fdd7b4b4af",
                "participantId": null,
                "participantName": null,
                "participantRole": null,
                "content": "Conversation closed",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T12:43:25.553Z",
                "attachments": {}
            }
        ]
    }
}




{
    "status": "success",
    "message": "Transcripts fetched successfully for ucid: 3aed2a76-346e-4295-b03b-7dd6cd952276",
    "data": {
        "id": "415fe54b-9113-432f-a068-e94ee66f4b15",
        "ucid": "3aed2a76-346e-4295-b03b-7dd6cd952276",
        "contactId": "",
        "lastEvaluatedKey": "TIME#2025-10-15T11:51:28.533Z#ts#1760529088843272",
        "transcripts": [
            {
                "messageId": "ce3f5f69-95bc-4bf9-ba06-b7dcd61fe33e",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Participant Shyam Sharma has started a conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:47:34.227Z",
                "attachments": {}
            },
            {
                "messageId": "5a1f4137-ee64-47d7-bafc-1ffb91cf4efb",
                "participantId": "e9a1d4c4-b71f-4403-9a2d-4e80ca5be311",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "GoDaddy does not accept or ask for payment data over chat.  Do not include any payment card information or payment details in this chat.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:47:44.753Z",
                "attachments": {}
            },
            {
                "messageId": "7bf0bdbe-7d32-4d87-8107-6cc576e9633a",
                "participantId": "87c40104-4f35-4318-b0a6-d6024dca2352",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "Hi, this is our virtual assistant! 👋 Tell us how we can help.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:47:46.855Z",
                "attachments": {}
            },
            {
                "messageId": "79afcd55-4601-43bf-a32d-94960f66f60d",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Hi",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:47:50.781Z",
                "attachments": {}
            },
            {
                "messageId": "72592d8a-4a3a-46d0-aebd-0021acd901f2",
                "participantId": "87c40104-4f35-4318-b0a6-d6024dca2352",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "Hello! How can I assist you today?",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:47:54.234Z",
                "attachments": {}
            },
            {
                "messageId": "40bfdf59-be21-40bd-ab29-f795c67444e4",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Please connect me to a guide",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:48:06.014Z",
                "attachments": {}
            },
            {
                "messageId": "20863b99-fb58-4432-9332-940fc781f4a2",
                "participantId": "87c40104-4f35-4318-b0a6-d6024dca2352",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "Sure thing! I'm connecting you to a guide now for assistance.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:48:14.928Z",
                "attachments": {}
            },
            {
                "messageId": "c96aca37-e6de-4418-8390-f5ceee1f8b53",
                "participantId": "e9a1d4c4-b71f-4403-9a2d-4e80ca5be311",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "Transferring to a guide…",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:48:24.172Z",
                "attachments": {}
            },
            {
                "messageId": "fd385f91-287a-460b-bc8e-753f70a019ef",
                "participantId": "e9a1d4c4-b71f-4403-9a2d-4e80ca5be311",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "Your estimated wait time is less than a minute.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:48:25.337Z",
                "attachments": {}
            },
            {
                "messageId": "fecb7ecf-33d3-439c-9a9f-a18a7ebb398c",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Sure",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:48:46.762Z",
                "attachments": {}
            },
            {
                "messageId": "b773615e-43c0-4331-80e9-00f9aec2846f",
                "participantId": "4a634a7e-2c1f-427f-a4cf-94a5d9d6bd81",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Participant Shyam joined with role AGENT",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:48:52.641Z",
                "attachments": {}
            },
            {
                "messageId": "832a4587-360c-42c3-8b8f-10b5c4ce9053",
                "participantId": "4a634a7e-2c1f-427f-a4cf-94a5d9d6bd81",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Hello",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:48:57.234Z",
                "attachments": {}
            },
            {
                "messageId": "207f4bd5-f815-45d1-905e-93e09e5f1675",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Can you please help me with my domain ak.com",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:49:08.379Z",
                "attachments": {}
            },
            {
                "messageId": "0cfc9a68-b9c5-4f6b-8dd2-eddd38e00890",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "i am unable to renew it ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:49:14.305Z",
                "attachments": {}
            },
            {
                "messageId": "cfe52799-26cb-407e-aeef-2779836a0b75",
                "participantId": "4a634a7e-2c1f-427f-a4cf-94a5d9d6bd81",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Sure please, can you please share the error you are getting while renew",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:49:36.095Z",
                "attachments": {}
            },
            {
                "messageId": "4684a94c-73d3-44c0-ba4a-41003083704f",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "it says card is not allowed ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:49:51.561Z",
                "attachments": {}
            },
            {
                "messageId": "499c2bb7-1087-45b8-8ef4-2da4813dbc36",
                "participantId": null,
                "participantName": null,
                "participantRole": null,
                "content": "Conversation transferred successfully",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:03.127Z",
                "attachments": {}
            },
            {
                "messageId": "313bd6af-fbf8-4ebd-80f0-c93426f8f782",
                "participantId": "4a634a7e-2c1f-427f-a4cf-94a5d9d6bd81",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Participant Shyam left the conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:03.175Z",
                "attachments": {}
            },
            {
                "messageId": "64aba386-aee3-46d5-a590-a20e20e768c9",
                "participantId": "e9a1d4c4-b71f-4403-9a2d-4e80ca5be311",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "Transferring to a guide…",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:03.471Z",
                "attachments": {}
            },
            {
                "messageId": "52b32f00-3cfd-4d0b-a361-a3c8ede42075",
                "participantId": "e9a1d4c4-b71f-4403-9a2d-4e80ca5be311",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "Your estimated wait time is less than a minute.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:04.434Z",
                "attachments": {}
            },
            {
                "messageId": "4b9215bc-2d3a-4ed9-812e-be54158f03dc",
                "participantId": "6883040a-bb63-4b5c-ac5d-43d097894b79",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Participant Shyam joined with role AGENT",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:16.091Z",
                "attachments": {}
            },
            {
                "messageId": "7b672198-e7ae-4e43-a327-01aad2f80f86",
                "participantId": "6883040a-bb63-4b5c-ac5d-43d097894b79",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Hi",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:36.601Z",
                "attachments": {}
            },
            {
                "messageId": "1e9aa6fd-38cb-4414-8e00-436a89a45ae2",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "Hello",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:41.072Z",
                "attachments": {}
            },
            {
                "messageId": "08494bf2-68d0-468a-8ba4-6c85836f85be",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "you a new agent now rihgt ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:47.143Z",
                "attachments": {}
            },
            {
                "messageId": "d4f3497f-c1c3-45e2-84b7-30979fc582ef",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "can you check my chat logs",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:50:56.940Z",
                "attachments": {}
            },
            {
                "messageId": "bb369a7b-bd04-45dc-b4cc-212d81c2379e",
                "participantId": "f186666b-bea5-4c73-8cd2-3700fabe0fb0",
                "participantName": "Shyam Sharma",
                "participantRole": "CUSTOMER",
                "content": "and share the solution ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:51:04.071Z",
                "attachments": {}
            },
            {
                "messageId": "172be097-e7d2-4781-85ee-ed6abecc0ca4",
                "participantId": "6883040a-bb63-4b5c-ac5d-43d097894b79",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Sure please let me review the logs ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:51:22.610Z",
                "attachments": {}
            },
            {
                "messageId": "8f31218d-5fb7-47ab-9908-74abfb44f145",
                "participantId": "6883040a-bb63-4b5c-ac5d-43d097894b79",
                "participantName": "Shyam",
                "participantRole": "AGENT",
                "content": "Participant Shyam left the conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:51:25.358Z",
                "attachments": {}
            },
            {
                "messageId": "a8f2895e-e3a5-4d18-a308-050b69d3b898",
                "participantId": null,
                "participantName": null,
                "participantRole": null,
                "content": "Conversation closed",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:51:28.533Z",
                "attachments": {}
            }
        ]
    }
}



{
    "status": "success",
    "message": "Transcripts fetched successfully for ucid: 72596159-9805-4885-a31c-1e60e9fdcd8f",
    "data": {
        "id": "df47b7b8-df39-4e57-bd5b-9037a8659b76",
        "ucid": "72596159-9805-4885-a31c-1e60e9fdcd8f",
        "contactId": "",
        "lastEvaluatedKey": "TIME#2025-10-15T11:13:29.211Z#ts#1760526810179720",
        "transcripts": [
            {
                "messageId": "4b91e3d1-0b2b-4172-829f-c7d1067e82d3",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "Participant Jyoti Kumari has started a conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:52:33.952Z",
                "attachments": {}
            },
            {
                "messageId": "b1284898-875a-40cc-a56a-a7f06414dc20",
                "participantId": "e0eb9076-a174-4c2b-a0c4-807c500acdd9",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "GoDaddy does not accept or ask for payment data over chat.  Do not include any payment card information or payment details in this chat.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:52:43.749Z",
                "attachments": {}
            },
            {
                "messageId": "f852186b-4094-4536-9797-a3bfeb8d4706",
                "participantId": "f8745fc6-8a05-4849-9c74-e413d8b07968",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "Hi, this is our virtual assistant! 👋 Tell us how we can help.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:52:45.579Z",
                "attachments": {}
            },
            {
                "messageId": "bb446b6f-1f85-47f1-baa2-091704c5e280",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "hi ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:52:52.298Z",
                "attachments": {}
            },
            {
                "messageId": "2e1869e1-305f-4f05-9bf7-89b4243aa0c1",
                "participantId": "f8745fc6-8a05-4849-9c74-e413d8b07968",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "Hello! How can I assist you today?",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:52:54.725Z",
                "attachments": {}
            },
            {
                "messageId": "7149052e-7ffc-48f5-9464-d8738da17c1a",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "i am facing issues with mwp. I am incurring monetary losses. I will take you to court and make the company liable for this ",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:54:11.186Z",
                "attachments": {}
            },
            {
                "messageId": "4f31182e-e1d8-4280-bcc6-f803943bd36d",
                "participantId": "f8745fc6-8a05-4849-9c74-e413d8b07968",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "I'm here to help. Could you tell me more about the issues you're encountering with Managed WordPress Hosting?",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:54:13.582Z",
                "attachments": {}
            },
            {
                "messageId": "ff55fbdf-f7d5-4140-b549-5c04c6bbeda4",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "connect me to a guide",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:55:48.791Z",
                "attachments": {}
            },
            {
                "messageId": "79e14611-aa10-4e33-9d13-4b62037280a2",
                "participantId": "f8745fc6-8a05-4849-9c74-e413d8b07968",
                "participantName": "AI Assistant",
                "participantRole": "CUSTOM_BOT",
                "content": "I'll connect you to a Guide for assistance with Managed WordPress Hosting.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:55:54.984Z",
                "attachments": {}
            },
            {
                "messageId": "2ad90d5f-b23d-4c67-ae7e-639dfb6578de",
                "participantId": "e0eb9076-a174-4c2b-a0c4-807c500acdd9",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "Transferring to a guide…",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:56:02.710Z",
                "attachments": {}
            },
            {
                "messageId": "8f94ea84-5a40-4e9e-a176-1be1a052c899",
                "participantId": "e0eb9076-a174-4c2b-a0c4-807c500acdd9",
                "participantName": "SYSTEM_MESSAGE",
                "participantRole": "SYSTEM",
                "content": "Your estimated wait time is less than a minute.",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:56:03.922Z",
                "attachments": {}
            },
            {
                "messageId": "dbb51a0d-5c90-4a79-a1a8-f312529708e6",
                "participantId": "53788828-211f-415e-b2d8-30a81402fc9f",
                "participantName": "Jyoti",
                "participantRole": "AGENT",
                "content": "Participant Jyoti joined with role AGENT",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T10:56:07.676Z",
                "attachments": {}
            },
            {
                "messageId": "7d9f8c6d-9bcc-4061-ac66-4fd7e8d033e6",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "Participant Jyoti Kumari with role CUSTOMER went idle",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:01:08.192Z",
                "attachments": {}
            },
            {
                "messageId": "e9fb844d-347e-4789-a3fc-738fc6f7c15d",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "yes",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:04:12.928Z",
                "attachments": {}
            },
            {
                "messageId": "6d1ebd48-a561-413d-bdcc-506fb7a74f4d",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "i am here",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:04:20.740Z",
                "attachments": {}
            },
            {
                "messageId": "1636bfb2-a5f1-465b-a331-fc172530e255",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "Participant Jyoti Kumari with role CUSTOMER went idle",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:09:21.381Z",
                "attachments": {}
            },
            {
                "messageId": "9dc528c2-495d-40e8-9180-9340df4ba4fd",
                "participantId": "be5dfb64-5662-4e2d-b211-6e060c209e5b",
                "participantName": "Jyoti Kumari",
                "participantRole": "CUSTOMER",
                "content": "Customer Jyoti Kumari has left the conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:13:28.925Z",
                "attachments": {}
            },
            {
                "messageId": "1eabf9e3-b334-4a3e-aa71-fcbabc7bd83b",
                "participantId": "jkumari1",
                "participantName": "Jyoti",
                "participantRole": "AGENT",
                "content": "Participant Jyoti left the conversation",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:13:28.925Z",
                "attachments": []
            },
            {
                "messageId": "e2b7c2e8-949d-4471-9ebd-4446cf05e29d",
                "participantId": null,
                "participantName": null,
                "participantRole": null,
                "content": "Conversation closed",
                "source": "amazonconnect",
                "absoluteTime": "2025-10-15T11:13:29.211Z",
                "attachments": {}
            }
        ]
    }
}
`;

export { SAMPLE_TRANSCRIPTS as sampleTranscripts };