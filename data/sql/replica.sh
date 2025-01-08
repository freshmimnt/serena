#!/bin/bash
mysql -uroot -proot <<EOF
STOP SLAVE;
CHANGE MASTER TO
  MASTER_HOST='mysql_master',
  MASTER_USER='serena',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=4;
START SLAVE;
EOF

