FROM nginx

RUN echo 'Asia/Shanghai' >/etc/timezone
RUN mkdir /usr/share/nginx/html/market
RUN rm /usr/share/nginx/html/index.html
COPY build/ /usr/share/nginx/html/market
COPY conf/default.conf /etc/nginx/conf.d
COPY conf/nginx.conf /etc/nginx

