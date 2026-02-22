# Kubernetes Deployment

## Files
- `configmap.yaml` - ConfigMap and Secret for environment variables
- `deployment.yaml` - Deployment for Next.js application
- `service.yaml` - Service for the application
- `ingress.yaml` - Ingress for external access
- `postgres-deployment.yaml` - PostgreSQL database
- `pvc.yaml` - PersistentVolumeClaim for data

## Deployment

1. Create namespace (optional):
```bash
kubectl create namespace invoicer
```

2. Apply configurations:
```bash
kubectl apply -f kubernetes/
```

3. Monitor status:
```bash
kubectl get pods -n invoicer
kubectl logs -f deployment/invoicer-app -n invoicer
```

## Notes
- Update `NEXTAUTH_SECRET` in `configmap.yaml` for production
- Ingress uses `invoicer.local` - adjust according to your domain
- For production, consider using cert-manager for HTTPS
- Consider using external PostgreSQL database for production
