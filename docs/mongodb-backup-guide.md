# VEYNCORE – MongoDB Atlas Backup & Disaster Recovery Guide

This guide outlines the standard operating procedures for backing up, securing, and restoring the VEYNCORE production MongoDB database.

---

## 1. Understanding Backup Capabilities by Tier

MongoDB Atlas backup capabilities depend on the deployed cluster tier:

| Tier | Tier Type | Backup Capability | Retention & PITR |
| :--- | :--- | :--- | :--- |
| **M0 Sandbox** | Free Shared | **No automated backups**. Manual export required via `mongodump`. | None. Snapshots and point-in-time recovery are unavailable. |
| **M2 / M5** | Shared Flex | Basic automated daily snapshots. | 1 snapshot retained daily. PITR unavailable. |
| **M10+** | Dedicated Cluster | **Continuous Cloud Backups**. Automated hourly snapshots + Continuous Oplog archiving. | Configurable retention (up to 1 year). Point-in-Time Recovery (PITR) enabled. |

### How to Check Your Current Cluster Tier in MongoDB Atlas
1. Sign in to the [MongoDB Atlas Console](https://cloud.mongodb.com).
2. Select your Organization and the **VEYNCORE** Project.
3. In the **Database Deployments** screen, locate your cluster (e.g. `Cluster0`).
4. Review the tier label directly beneath the cluster name (e.g., `M0 Sandbox`, `M2`, or `M10`).
5. Click **Backup** in the left sidebar to inspect configured snapshot schedules and policies.

---

## 2. Manual Backup via `mongodump` (Recommended for M0 / Shared Tiers)

For clusters on shared tiers where automated cloud snapshots are unavailable, perform scheduled manual logical backups using MongoDB Database Tools (`mongodump`).

### Prerequisites
* Install [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools) on your local administrative machine.
* Ensure your administrative IP address is temporarily whitelisted in **Network Access** in the Atlas Console.

### Secure Backup Procedure

1. Open your administrative terminal.
2. Define a timestamped backup directory:
   ```bash
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_DIR="./backups/veyncore_${TIMESTAMP}"
   mkdir -p "${BACKUP_DIR}"
   ```
3. Run `mongodump` over TLS using standard URI parameters (substituting your credentials):
   ```bash
   mongodump --uri="mongodb+srv://<DB_USERNAME>:<DB_PASSWORD>@<CLUSTER_HOST>/veyncore" \
             --archive="${BACKUP_DIR}/veyncore.archive.gz" \
             --gzip
   ```
   > [!NOTE]
   > The `--gzip` and `--archive` flags compress the entire database into a single stream, minimizing disk footprint and preventing plaintext file inspection.

---

## 3. Protecting Backup Files and Credentials

1. **Credential Hygiene**:
   * Never commit `.archive`, `.archive.gz`, or raw `.bson` dump directories into Git.
   * Verify that `backups/` and `*.archive.gz` are listed in `.gitignore`.
   * Never store database passwords in shell history or automation scripts. Use environment variables:
     ```bash
     read -s -p "Enter Database Password: " MONGOPASS
     mongodump --uri="mongodb+srv://admin:${MONGOPASS}@<CLUSTER_HOST>/veyncore" --archive=...
     unset MONGOPASS
     ```
2. **Encrypted Storage**:
   * Encrypt archive files before storing off-site using GPG or age:
     ```bash
     gpg --symmetric --cipher-algo AES256 ./backups/veyncore_*.archive.gz
     ```
   * Store encrypted backups in an encrypted private cloud bucket (e.g., AWS S3 with KMS or Google Cloud Storage) with bucket versioning enabled.

---

## 4. Disaster Recovery & Restoration Procedure (`mongorestore`)

> [!CAUTION]
> Restoring a database overwrite (`--drop`) will replace existing collections. Never execute this against a production cluster without explicit change approval and an initial precautionary backup.

### Standard Database Restore
To restore an archived backup file to a target cluster:

```bash
mongorestore --uri="mongodb+srv://<DB_USERNAME>:<DB_PASSWORD>@<TARGET_CLUSTER_HOST>/veyncore" \
             --archive="./backups/veyncore_YYYYMMDD_HHMMSS/veyncore.archive.gz" \
             --gzip \
             --drop
```

* `--drop`: Drops existing collections before restoring to avoid duplicate key conflicts.
* `--gzip`: Decompresses gzipped BSON streams on the fly.

---

## 5. Post-Restore Verification Checklist

After restoring to a staging or recovery environment, run the following verification steps:

1. **Connection & Schema Check**:
   * Connect via `mongosh` or backend server.
   * Verify collection presence:
     ```javascript
     use veyncore;
     show collections;
     // Expected: users, products, orders, sitecontents, launchsales, subcategories, media
     ```
2. **Document Counts & Integrity**:
   * Verify product catalog count matches previous state:
     ```javascript
     db.products.countDocuments();
     ```
   * Verify indexes are intact:
     ```javascript
     db.products.getIndexes();
     db.users.getIndexes();
     ```
3. **Application Smoke Test**:
   * Launch backend pointing to the restored database.
   * Probe `/api/health`, `/api/products`, and `/api/launch-sales/active` to confirm HTTP 200 responses.
