# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
#USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ReactImageTranslator.Server/ReactImageTranslator.Server.csproj", "ReactImageTranslator.Server/"]
COPY ["reactimagetranslator.client/reactimagetranslator.client.esproj", "reactimagetranslator.client/"]
RUN dotnet restore "./ReactImageTranslator.Server/ReactImageTranslator.Server.csproj"
COPY . .
WORKDIR "/src/ReactImageTranslator.Server"
RUN dotnet build "./ReactImageTranslator.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build



# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish

ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./ReactImageTranslator.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final


########################### setup python
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# get python 3.10

# install python 3.10
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    python3-pip \
    #build-essential \
    && rm -rf /var/lib/apt/lists/*


ENV PYTHONUNBUFFERED=1


# activate venv and install packages for translation
RUN python3 -m venv /opt/venv
RUN . /opt/venv/bin/activate && \
    pip install --no-cache-dir torch torchvision torchaudio && \
    pip install --no-cache-dir opencv-contrib-python-headless && \
    pip install --no-cache-dir manga-ocr && \
    pip install --no-cache-dir easyocr && \
    pip install --no-cache-dir deepl && \
    pip install --no-cache-dir deep_translator

# setup manga ocr
RUN ../opt/venv/bin/python3 -c "from manga_ocr import MangaOcr; mocr = MangaOcr()"

    #pip install --no-cache-dir \
    #torch==2.0.0 \
    #torchvision==0.15.1 \
    #torchaudio==2.0.1 \
    #--index-url https://download.pytorch.org/whl/cu118 && \
###########################

WORKDIR /app
COPY --from=publish /app/publish .
COPY ReactImageTranslator.Server/PythonImageTranslation /app/PythonImageTranslation/
#COPY ReactImageTranslator.Server/PythonImageTranslation/requirements.txt /app/requirements.txt

#temporary comment until better solution - need root to create directory for output folders
#USER $APP_UID

ENTRYPOINT ["dotnet", "ReactImageTranslator.Server.dll"]




