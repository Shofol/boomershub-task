# MinIO Setup Guide

This guide explains how to set up MinIO for storing and displaying property images in the BoomersHub application.

## What is MinIO?

MinIO is a high-performance object storage service that's compatible with Amazon S3. It's used in this application to store and serve property images.

## Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

1. Create the MinIO data directory:
```bash
mkdir -p ~/minio/data
```

2. Start MinIO using Docker Compose:
```bash
docker-compose -f docker-compose.yml up -d
```

### Option 2: Using Docker Run

1. Create the MinIO data directory:
```bash
mkdir -p ~/minio/data
```

2. Run MinIO container:
```bash
docker run \
    -p 9000:9000 \
    -p 9090:9090 \
    --name minio \
    -v ~/minio/data:/data \
    -e "MINIO_ROOT_USER=root" \
    -e "MINIO_ROOT_PASSWORD=password" \
    quay.io/minio/minio server /data --console-address ":9090"
```

## Accessing MinIO

### Web Console
- **URL**: http://localhost:9090
- **Username**: root
- **Password**: password

### API Endpoint
- **URL**: http://localhost:9000
- **Access Key**: root
- **Secret Key**: password

## Bucket Structure

The application automatically creates a bucket named `boomershub` with the following structure:

```
boomershub/
├── Brookdale Creekside/     # Property name
│   ├── main.jpg            # Main property image
│   ├── exterior.jpg        # Exterior view
│   └── interior.jpg        # Interior view
├── The Delaney At Georgetown Village/  # Property name
│   ├── main.jpg
│   └── ...
└── ...
```

**Important**: Images must be stored using the exact property name as the folder name, matching the property names in your CSV file.

## Environment Variables

Add these to your `.env` file:

```env
# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=root
MINIO_SECRET_KEY=password
```

## API Endpoints

The application provides the following endpoints for working with property images:

- `GET /api/properties` - Get all properties with main images
- `GET /api/properties/:id` - Get property details with all images
- `GET /api/properties/:id/images` - Get all images for a specific property

## Image Display

Property images are automatically displayed in the client interface:

1. **Main Image**: Shows as a thumbnail (64x64px) next to property details
2. **All Images**: Available when viewing individual property details
3. **Error Handling**: Images that fail to load are automatically hidden

## Troubleshooting

### MinIO Connection Issues

1. **Check if MinIO is running**:
```bash
docker ps | grep minio
```

2. **Check MinIO logs**:
```bash
docker logs minio
```

3. **Restart MinIO**:
```bash
docker restart minio
```

### Image Display Issues

1. **Check bucket exists**:
   - Access MinIO console at http://localhost:9090
   - Verify `boomershub` bucket exists

2. **Check image paths**:
   - Images should be stored as `{propertyName}/{imageName}`
   - Example: `Brookdale Creekside/main.jpg` for property "Brookdale Creekside"

3. **Check presigned URLs**:
   - URLs are valid for 1 hour by default
   - Check browser console for image loading errors

### Common Issues

1. **Port conflicts**: Make sure ports 9000 and 9090 are available
2. **Permission issues**: Ensure the `~/minio/data` directory has proper permissions
3. **Network issues**: Verify MinIO is accessible from your application

## Security Notes

- This setup uses default credentials for development
- For production, use strong passwords and SSL
- Consider using environment variables for all credentials
- Implement proper access controls and bucket policies

## Next Steps

1. Start MinIO using one of the methods above
2. Start your application server
3. Upload images to the `boomershub` bucket using property names as folders
4. Images will automatically appear in the property listings 