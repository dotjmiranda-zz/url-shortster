# URL Shortster

URL shortening service API

# Setup

**NodeJS v14+ & NPM v6+ required**

1. npm install
2. npm start

# Tests

1. npm test

# API Documentation

API Documentation for URL Shortster

## **Method**

`GET /:shortcode`

### **Path Parameters**

| Name      | Description     | Call Example |
| --------- | --------------- | ------------ |
| shortcode | URL's Shortcode | /boogle      |

### **Success Response**

#### **Code** 200

#### **Content:**

Redirects to the shortcode's URL

### **Error Response**

#### **Code** 404

#### **Content:**

```json
{
  "error": {
    "status": 404,
    "message": "Shortcode not found"
  }
}
```

`GET /:shortcode/stats`

### **Path Parameters**

| Name      | Description     | Call Example |
| --------- | --------------- | ------------ |
| shortcode | URL's Shortcode | /boogle      |

### **Success Response**

#### **Code** 200

#### **Content:**

```json
{
  "shortcode": "videos",
  "url": "https://www.youtube.com/",
  "lastAccess": "12/12/2020 15:31",
  "counter": 5
}
```

`POST /addShortcode`

### **Request Body**

```json
{
  "url": "https://twitter.com",
  "shortcode": "tweet"
}
```

### **Success Response**

#### **Code** 200

#### **Content:**

```json
{
  "shortcode": "tweet",
  "url": "https://twitter.com",
  "createdAt": "14/12/2020 14:28",
  "lastAccess": "",
  "counter": 0
}
```

### **Error Response**

#### **Code** 409

#### **Content:**

```json
{
  "error": {
    "status": 409,
    "message": "Shortcode already exists"
  }
}
```

#### **Code** 400

#### **Content:**

```json
{
  "error": {
    "status": 400,
    "message": "Shortcodes must be atleast 4 characters long"
  }
}
```
