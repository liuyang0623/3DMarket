FROM harbor.wdabuliu.com/note/nginx:v1

RUN echo 'Asia/Shanghai' >/etc/timezone
RUN mkdir /usr/share/nginx/html/space3d
RUN rm /usr/share/nginx/html/index.html
COPY dist/ /usr/share/nginx/html/space3d
RUN mkdir /usr/share/nginx/html/space3d/godotGzip
WORKDIR /usr/share/nginx/html/space3d/godot
RUN for i in `ls *`;do gzip -c $i >/usr/share/nginx/html/space3d/godotGzip/$i.gz;done
WORKDIR /usr/share/nginx/html/space3d/
RUN cp -r godotGzip/. godot
RUN rm -rf godotGzip
COPY conf/default.conf /etc/nginx/conf.d
COPY conf/nginx.conf /etc/nginx