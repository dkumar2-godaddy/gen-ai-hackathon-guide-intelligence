// collated conversation state data for specific customer sessions in a specific time frame

const SAMPLE_CONVERSATION_STATE = `
{
    "status": "success",
    "message": "Conversation data retrieved successfully",
    "data": [
        {
            "conversationInfo": {
                "ucid": "b4a95870-5acb-4e23-a535-49b608e4edd0",
                "initialContactId": "5320e3d9-e2bd-45e2-bafe-2820f6ab03a0",
                "contactCenterId": "gd-dev-us-001",
                "contactCenterInstanceId": "c59e72b1-8128-4700-aa34-4458ed45a723",
                "connectInstanceAlias": "gd-dev-us-001",
                "customerAuthenticated": true,
                "customerDisplayName": "Shyam Sharma",
                "brandCustomerId": "7567349",
                "customerId": "03682c54-9ea2-462b-bd9d-9eea1cc23379",
                "visitId": "dba019e6-bf2e-4d90-b7fc-51fcb6b74179",
                "visitorId": "dba019e6-bf2e-4d90-b7fc-51fcb6b74179",
                "createdAt": "2025-10-15T12:14:34.480027Z",
                "updatedAt": "2025-10-15T12:41:19.631Z",
                "platform": "amazonconnect",
                "channel": "web",
                "market": "en-US",
                "customerJoinedTimestamp": "2025-10-15T12:14:34.480027Z",
                "plId": "1",
                "supportLevel": "L1",
                "location": "https://topology.care.dev-godaddy.com/v1/care/web-chat/test-harness",
                "app": "",
                "summary": "Customer reported difficulty renewing domain 'ak.com', claiming the domain shows as already taken despite using it for 5 years. No clear resolution was reached during the support interaction.",
                "conversationEndTimestamp": "2025-10-15T12:43:23.000Z",
                "interactionType": "Guide",
                "durationSeconds": 298,
                "latestQueueStatus": "",
                "latestQueue": "GD-L1-Idle",
                "deviceInfo": "desktop",
                "conversations": [
                    {
                        "ucid": "b4a95870-5acb-4e23-a535-49b608e4edd0",
                        "contactId": "3f5e6f0a-27c7-45a3-80f7-974f1f3dce73",
                        "initialContactId": "5320e3d9-e2bd-45e2-bafe-2820f6ab03a0",
                        "state": "COMPLETED",
                        "agentId": "ssharma9",
                        "createdAt": "2025-10-15T12:38:45.893631Z",
                        "updatedAt": "2025-10-15T12:43:22.105574Z",
                        "conversationStartTimestamp": "2025-10-15T12:38:45.893631Z",
                        "conversationEndTimestamp": "2025-10-15T12:43:21.464Z",
                        "durationSeconds": "275",
                        "agentLastMessageTimeStamp": "2025-10-15T12:41:35.476Z",
                        "agentDisplayName": "Shyam",
                        "agentJoinedTimestamp": "2025-10-15T12:38:46.952Z",
                        "agentLeftTimestamp": "2025-10-15T12:43:21.464Z",
                        "customerLastMessageTimeStamp": "2025-10-15T12:41:14.370Z",
                        "disconnectReason": "AGENT_DISCONNECT",
                        "endDescription": "Agent explicitly disconnects or rejects a chat.",
                        "routingProfileName": "Admin",
                        "queueName": "GD-L1-General-English-FOS-TOP"
                    },
                    {
                        "ucid": "b4a95870-5acb-4e23-a535-49b608e4edd0",
                        "contactId": "5320e3d9-e2bd-45e2-bafe-2820f6ab03a0",
                        "initialContactId": "5320e3d9-e2bd-45e2-bafe-2820f6ab03a0",
                        "state": "COMPLETED",
                        "agentId": "ssharma9",
                        "createdAt": "2025-10-15T12:15:35.004471Z",
                        "updatedAt": "2025-10-15T12:38:20.426062Z",
                        "conversationStartTimestamp": "2025-10-15T12:15:35.004471Z",
                        "conversationEndTimestamp": "2025-10-15T12:27:09.129Z",
                        "durationSeconds": "694",
                        "agentLastMessageTimeStamp": "2025-10-15T12:17:21.332Z",
                        "agentDisplayName": "Shyam",
                        "agentJoinedTimestamp": "2025-10-15T12:15:35.271Z",
                        "agentLeftTimestamp": "2025-10-15T12:27:09.129Z",
                        "customerLastMessageTimeStamp": "2025-10-15T12:17:08.515Z",
                        "disconnectReason": "IDLE_DISCONNECT",
                        "endDescription": "Disconnect due to an idle participant.",
                        "routingProfileName": "Admin",
                        "queueName": "GD-L1-General-English-FOS-TOP"
                    },
                    {
                        "ucid": "b4a95870-5acb-4e23-a535-49b608e4edd0",
                        "contactId": "5320e3d9-e2bd-45e2-bafe-2820f6ab03a0",
                        "initialContactId": "5320e3d9-e2bd-45e2-bafe-2820f6ab03a0",
                        "state": "COMPLETED",
                        "agentId": "CUSTOM_BOT",
                        "createdAt": "2025-10-15T12:14:51.452730Z",
                        "updatedAt": "2025-10-15T12:15:26.520446Z",
                        "conversationStartTimestamp": "2025-10-15T12:14:51.452730Z",
                        "conversationEndTimestamp": "2025-10-15T12:15:17.305Z",
                        "durationSeconds": "25",
                        "agentLastMessageTimeStamp": "2025-10-15T12:15:17.034Z",
                        "agentDisplayName": "",
                        "agentJoinedTimestamp": "2025-10-15T12:14:51.452730Z",
                        "agentLeftTimestamp": "2025-10-15T12:15:17.305Z"
                    }
                ],
                "id": "5320e3d9-e2bd-45e2-bafe-2820f6ab03a0"
            }
        }
    ]
}



{
    "status": "success",
    "message": "Conversation data retrieved successfully",
    "data": [
        {
            "conversationInfo": {
                "ucid": "3aed2a76-346e-4295-b03b-7dd6cd952276",
                "initialContactId": "415fe54b-9113-432f-a068-e94ee66f4b15",
                "contactCenterId": "gd-dev-us-001",
                "contactCenterInstanceId": "c59e72b1-8128-4700-aa34-4458ed45a723",
                "connectInstanceAlias": "gd-dev-us-001",
                "customerAuthenticated": true,
                "customerDisplayName": "Shyam Sharma",
                "brandCustomerId": "7567349",
                "customerId": "03682c54-9ea2-462b-bd9d-9eea1cc23379",
                "visitId": "bd536571-c4f6-4ed7-87b7-20c258793fdd",
                "visitorId": "bd536571-c4f6-4ed7-87b7-20c258793fdd",
                "createdAt": "2025-10-15T11:47:38.961191Z",
                "updatedAt": "2025-10-15T11:51:10.012Z",
                "platform": "amazonconnect",
                "channel": "web",
                "market": "en-US",
                "customerJoinedTimestamp": "2025-10-15T11:47:38.961191Z",
                "plId": "1",
                "supportLevel": "L1",
                "location": "https://topology.care.dev-godaddy.com/v1/care/web-chat/test-harness",
                "app": "",
                "summary": "User attempted to renew domain 'ak.com' but encountered an error stating the card was not allowed. Multiple agent transfers occurred while trying to resolve the payment issue.",
                "conversationEndTimestamp": "2025-10-15T11:51:27.000Z",
                "interactionType": "Guide",
                "durationSeconds": 74,
                "latestQueueStatus": "",
                "latestQueue": "",
                "deviceInfo": "desktop",
                "conversations": [
                    {
                        "ucid": "3aed2a76-346e-4295-b03b-7dd6cd952276",
                        "contactId": "ddaacd7c-a7f0-46d7-b51a-6aca2aefd413",
                        "initialContactId": "415fe54b-9113-432f-a068-e94ee66f4b15",
                        "state": "COMPLETED",
                        "agentId": "ssharma9",
                        "createdAt": "2025-10-15T11:50:15.830832Z",
                        "updatedAt": "2025-10-15T11:51:25.727701Z",
                        "conversationStartTimestamp": "2025-10-15T11:50:15.830832Z",
                        "conversationEndTimestamp": "2025-10-15T11:51:25.358Z",
                        "durationSeconds": "69",
                        "agentLastMessageTimeStamp": "2025-10-15T11:51:22.610Z",
                        "agentDisplayName": "Shyam",
                        "agentJoinedTimestamp": "2025-10-15T11:50:16.091Z",
                        "agentLeftTimestamp": "2025-10-15T11:51:25.358Z",
                        "customerLastMessageTimeStamp": "2025-10-15T11:51:04.071Z",
                        "disconnectReason": "AGENT_DISCONNECT",
                        "endDescription": "Agent explicitly disconnects or rejects a chat.",
                        "routingProfileName": "Admin",
                        "queueName": "123-L1-General-English-FOS-GB"
                    },
                    {
                        "ucid": "3aed2a76-346e-4295-b03b-7dd6cd952276",
                        "contactId": "415fe54b-9113-432f-a068-e94ee66f4b15",
                        "initialContactId": "415fe54b-9113-432f-a068-e94ee66f4b15",
                        "state": "COMPLETED",
                        "agentId": "ssharma9",
                        "createdAt": "2025-10-15T11:48:52.434730Z",
                        "updatedAt": "2025-10-15T11:50:03.431946Z",
                        "conversationStartTimestamp": "2025-10-15T11:48:52.434730Z",
                        "conversationEndTimestamp": "2025-10-15T11:50:03.127Z",
                        "durationSeconds": "70",
                        "agentLastMessageTimeStamp": "2025-10-15T11:49:36.095Z",
                        "agentDisplayName": "Shyam",
                        "agentJoinedTimestamp": "2025-10-15T11:48:52.641Z",
                        "customerLastMessageTimeStamp": "2025-10-15T11:49:51.561Z",
                        "disconnectReason": "none",
                        "endDescription": null,
                        "routingProfileName": "Admin",
                        "queueName": "GD-L1-General-English-FOS-TOP"
                    },
                    {
                        "ucid": "3aed2a76-346e-4295-b03b-7dd6cd952276",
                        "contactId": "415fe54b-9113-432f-a068-e94ee66f4b15",
                        "initialContactId": "415fe54b-9113-432f-a068-e94ee66f4b15",
                        "state": "COMPLETED",
                        "agentId": "CUSTOM_BOT",
                        "createdAt": "2025-10-15T11:47:47.139878Z",
                        "updatedAt": "2025-10-15T11:50:40.051247Z",
                        "conversationStartTimestamp": "2025-10-15T11:47:47.139878Z",
                        "conversationEndTimestamp": "2025-10-15T11:48:15.217Z",
                        "durationSeconds": "28",
                        "agentLastMessageTimeStamp": "2025-10-15T11:48:14.928Z",
                        "agentDisplayName": "",
                        "agentJoinedTimestamp": "2025-10-15T11:47:47.139878Z",
                        "agentLeftTimestamp": "2025-10-15T11:48:15.217Z"
                    }
                ],
                "id": "415fe54b-9113-432f-a068-e94ee66f4b15"
            }
        }
    ]
}


{
    "status": "success",
    "message": "Conversation data retrieved successfully",
    "data": [
        {
            "conversationInfo": {
                "ucid": "72596159-9805-4885-a31c-1e60e9fdcd8f",
                "initialContactId": "df47b7b8-df39-4e57-bd5b-9037a8659b76",
                "contactCenterId": "gd-dev-us-001",
                "contactCenterInstanceId": "c59e72b1-8128-4700-aa34-4458ed45a723",
                "connectInstanceAlias": "gd-dev-us-001",
                "customerAuthenticated": true,
                "customerDisplayName": "Jyoti Kumari",
                "brandCustomerId": "7645127",
                "customerId": "2457bcb0-4949-47ee-9a24-065055103788",
                "visitId": "51c69ac5-6f39-4db7-94f9-84471ef6ba38",
                "visitorId": "2bc5c2d5-1816-4f51-8a73-6cbed38c4fb4",
                "createdAt": "2025-10-15T10:52:38.161946Z",
                "updatedAt": "2025-10-15T11:04:27.163Z",
                "platform": "amazonconnect",
                "channel": "web",
                "market": "en-US",
                "customerJoinedTimestamp": "2025-10-15T10:52:38.161946Z",
                "plId": "1",
                "supportLevel": "L1",
                "location": "https://account.dev-godaddy.com/products?plid=1&ua_placement=shared_header",
                "app": "account",
                "summary": "Customer contacted support experiencing issues with Managed WordPress Hosting and requested connection to a support guide. The system initiated a transfer to a live support representative.",
                "conversationEndTimestamp": "2025-10-15T11:13:59.000Z",
                "interactionType": "Guide",
                "durationSeconds": 1070,
                "latestQueueStatus": "",
                "latestQueue": "",
                "deviceInfo": "desktop",
                "conversations": [
                    {
                        "ucid": "72596159-9805-4885-a31c-1e60e9fdcd8f",
                        "contactId": "df47b7b8-df39-4e57-bd5b-9037a8659b76",
                        "initialContactId": "df47b7b8-df39-4e57-bd5b-9037a8659b76",
                        "state": "COMPLETED",
                        "agentId": "jkumari1",
                        "createdAt": "2025-10-15T10:56:07.217525Z",
                        "updatedAt": "2025-10-15T11:13:29.693916Z",
                        "conversationStartTimestamp": "2025-10-15T10:56:07.217525Z",
                        "conversationEndTimestamp": "2025-10-15T11:13:28.925Z",
                        "durationSeconds": "1041",
                        "agentDisplayName": "Jyoti",
                        "agentJoinedTimestamp": "2025-10-15T10:56:07.676Z",
                        "customerLastMessageTimeStamp": "2025-10-15T11:04:20.740Z",
                        "disconnectReason": "CUSTOMER_DISCONNECT",
                        "endDescription": "Customer explicitly disconnects.",
                        "routingProfileName": "Admin",
                        "queueName": "GD-L1-General-English-FOS-TOP"
                    },
                    {
                        "ucid": "72596159-9805-4885-a31c-1e60e9fdcd8f",
                        "contactId": "df47b7b8-df39-4e57-bd5b-9037a8659b76",
                        "initialContactId": "df47b7b8-df39-4e57-bd5b-9037a8659b76",
                        "state": "COMPLETED",
                        "agentId": "CUSTOM_BOT",
                        "createdAt": "2025-10-15T10:52:45.882541Z",
                        "updatedAt": "2025-10-15T10:55:55.173Z",
                        "conversationStartTimestamp": "2025-10-15T10:52:45.882541Z",
                        "conversationEndTimestamp": "2025-10-15T10:55:55.173Z",
                        "durationSeconds": "189",
                        "agentLastMessageTimeStamp": "2025-10-15T10:55:54.984Z",
                        "agentDisplayName": "",
                        "agentJoinedTimestamp": "2025-10-15T10:52:45.882541Z",
                        "agentLeftTimestamp": "2025-10-15T10:55:55.173Z"
                    }
                ],
                "id": "df47b7b8-df39-4e57-bd5b-9037a8659b76"
            }
        }
    ]
}
`;

export { SAMPLE_CONVERSATION_STATE as sampleConversationState };