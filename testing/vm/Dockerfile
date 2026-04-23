FROM debian:trixie-slim

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

RUN apt-get update && apt-get install -y --no-install-recommends \
      systemd systemd-sysv dbus \
      sudo openssh-server \
      ca-certificates curl wget gnupg \
      nano less tree jq \
      iproute2 iputils-ping procps psmisc \
      python3 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Debian base images ship /usr/sbin/policy-rc.d that returns 101 during
# container builds, preventing postinst scripts from starting services.
# Remove it so `apt install tor` / `apt install tailscale` behave like
# they do on bare metal: the unit becomes enabled and active.
RUN rm -f /usr/sbin/policy-rc.d

RUN useradd --create-home --shell /bin/bash admin \
    && echo 'admin ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/admin-nopass \
    && chmod 440 /etc/sudoers.d/admin-nopass

# Test harness runs apt non-interactively; human readers of the guide
# still see and confirm prompts. Keeps guide prose honest.
RUN printf 'APT::Get::Assume-Yes "true";\nAPT::Get::Fix-Missing "true";\n' \
      > /etc/apt/apt.conf.d/99-raspibolt-test-yes \
    && printf '/usr/sbin' > /etc/login.defs.d-not-used-just-here-for-reference 2>/dev/null || true

# /usr/sbin on non-root PATH so `swapon --show`, `hdparm`, etc. resolve
# the way they do on a freshly-logged-in Pi user. /etc/environment is
# read by pam_env even on non-interactive ssh.
RUN echo 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games' \
      > /etc/environment

RUN mkdir -p /home/admin/.ssh && chmod 700 /home/admin/.ssh \
    && chown admin:admin /home/admin/.ssh

RUN mkdir -p /run/sshd && sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config \
    && sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config

RUN systemctl enable ssh.service

STOPSIGNAL SIGRTMIN+3
CMD ["/sbin/init"]
