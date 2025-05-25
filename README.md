# 0x-hackathon-project-
# StudyConnect - Student Networking Platform

A comprehensive student networking platform that enables university students to connect, collaborate, and enhance their academic experience through study groups, events, messaging, and peer discovery.

## 🏗️ System Architecture

```mermaid title="System Architecture Overview" type="diagram"
graph TB
    subgraph "Frontend Layer"
        A["React/Next.js App"]
        B["UI Components"]
        C["State Management"]
    end
    
    subgraph "Application Layer"
        D["Dashboard"]
        E["Student Directory"]
        F["Study Groups"]
        G["Events System"]
        H["Messaging"]
        I["Profile Management"]
    end
    
    subgraph "Data Layer"
        J["User Profiles"]
        K["Study Groups Data"]
        L["Events Data"]
        M["Messages Data"]
        N["Skills & Interests"]
    end
    
    subgraph "External Services"
        O["Authentication Provider"]
        P["File Storage"]
        Q["Push Notifications"]
        R["Email Service"]
    end
    
    A --> B
    A --> C
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    
    D --> J
    E --> J
    F --> K
    G --> L
    H --> M
    I --> J
    I --> N
    
    A --> O
    A --> P
    A --> Q
    A --> R
